import { GAP, circleFill } from "../canvas";
import { Arrow, Node } from "../element-types";
import { Line, Point } from "../geometry";
import { EventState } from "../playground/event-handler";
import { CanvasHandler } from "../playground/playground-handler";
import { ElementHandler } from "./element-handler";
import { ElementNode } from "./node";

export class ElementArrow extends ElementHandler {
	el: Arrow;
	parentNode: ElementNode;
	
	constructor(node: ElementNode) {
		super();
		this.el = new Arrow();
		this.parentNode = node;
		this.updateTail();
		this.el.head = { x: this.el.tail.x + GAP, y: this.el.tail.y };
	}

	updateTail() {
		this.el.tail = {
			x: (this.parentNode.el.dividerX() + this.parentNode.el.right) / 2,
			y: (this.parentNode.el.y + this.parentNode.el.bottom) / 2
		};
	}

	getRectifiedPos(node: Node, line: Line) {
		const rectLines = [
			// top
			[new Point(node.left, node.top), new Point(node.right, node.top)],
			// right
			[new Point(node.right, node.top), new Point(node.right, node.bottom)],
			// left
			[new Point(node.left, node.top), new Point(node.left, node.bottom)],
			// bottom
			[new Point(node.left, node.bottom), new Point(node.right, node.bottom)],
		];

		for(let i = 0; i < rectLines.length; i++) {
			const a = rectLines[i][0];
			const b = rectLines[i][1];
			const sideOfRect = new Line(a, b);

			if(sideOfRect.doIntersect(line)) {
				const o = sideOfRect.pointOfIntersect(line);
				return o
			}
		}
		return new Point(-1, -1);
	}

	rectifyPosition() {
		if(this.parentNode.next === null) return;
		const arrow = new Line(this.el.tail, this.el.head);
		this.el.head = this.getRectifiedPos(this.parentNode.next.el as Node, arrow);
	}

	pointerMove(state: EventState, canvas: CanvasHandler): void {
		let { x, y } = state.pointerMove;

		this.el.head.x = x;
		this.el.head.y = y;

		const el = canvas.finder.except(this.parentNode).ofTypes(ElementNode.name).find<ElementNode>(canvas.elements, x, y);
		
		if(el === null) {
			if(this.parentNode.next) {
				this.parentNode.next.prev = null;
				this.parentNode.next = null;
			}
			if(this.el.bg !== Arrow.notPointingColor) {
				this.el.bg = Arrow.notPointingColor;
			}
			canvas.redraw();
			return;
		}

		if(!(el?.prev)) {
			this.parentNode.next = el;
			this.parentNode.next.prev = this.parentNode;
			this.el.bg = Arrow.pointingColor;
		} else if(el && el.prev !== this.parentNode) {
			this.el.bg = "#FFFF00";
		}

		this.rectifyPosition();
		canvas.redraw();
	}

	async animateArrowHeadTo(canvas: CanvasHandler, arrow: Arrow, to: Point) {
		const line = new Line(arrow.head, to);
		let p = 0;

		return new Promise<void>((resolve, _reject) => {
			const fn = () => {
				arrow.head = line.getPositionAlongTheLine(p);
				p += 0.1;
				canvas.redraw();
				if(p >= 1) {
					arrow.head = line.getPositionAlongTheLine(1);
					resolve();
				} else {
					requestAnimationFrame(fn);
				}
			}
			requestAnimationFrame(fn);
		});
	}

	async insertNode(node: ElementNode, canvas: CanvasHandler) {
		this.el.bg = Arrow.notPointingColor;
		await this.animateArrowHeadTo(canvas, this.el, new Point(this.el.tail.x + GAP, this.el.tail.y));

		let toInsertStart = this.parentNode;
		while(toInsertStart.prev !== null) toInsertStart = toInsertStart.prev;

		let prev = node.prev as ElementNode;
		const prevArrow = prev.arrow;

		let rectified = prevArrow.getRectifiedPos(toInsertStart.el, new Line(prevArrow.el.tail, toInsertStart.defaultArrowPointPos()));
		await this.animateArrowHeadTo(canvas, prevArrow.el, rectified);

		prev.next = toInsertStart;
		
		rectified = this.getRectifiedPos(node.el, new Line(this.el.tail, node.defaultArrowPointPos()));
		await this.animateArrowHeadTo(canvas, this.el, rectified);

		this.parentNode.next = node;
		toInsertStart.prev = prev;
		node.prev = this.parentNode;

		this.el.bg = Arrow.pointingColor;
		canvas.redraw();
	}

	pointerUp(_state: EventState, canvas: CanvasHandler): ElementHandler | null {
		let { x, y } = this.el.head;

		const el = canvas.finder.except(this.parentNode).ofTypes(ElementNode.name).find<ElementNode>(canvas.elements, x, y);
		
		if(el === null) {
			return null;
		}

		if(el && el.prev !== this.parentNode) {
			this.insertNode(el, canvas);
			canvas.redraw();
		}
		return null;
	}

	isIntersect(x: number, y: number): null | ElementHandler {
		return this.el.isIntersect(x, y) ? this as any : null;
	}

	draw(canvas: HTMLCanvasElement) {
		const ctx = canvas.getContext("2d");
		if(ctx == null) return;

		if(this.el.head.x < 0) return;

		const { x: fromx, y: fromy } = this.el.tail;
		const { x: tox, y: toy } = this.el.head;
		const headlen = 15;
		const dx = tox - fromx;
		const dy = toy - fromy;
		const angle = Math.atan2(dy, dx);

		ctx.fillStyle = this.el.bg;
		ctx.strokeStyle = this.el.bg;
		circleFill(
			ctx,
			(this.parentNode.el.dividerX() + this.parentNode.el.right) / 2, (this.parentNode.el.y + this.parentNode.el.bottom) / 2,
			4, this.el.bg
		);

		ctx.beginPath();
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(tox, toy);
		ctx.stroke();

		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.moveTo(tox, toy);
		ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
		ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
	}
}

