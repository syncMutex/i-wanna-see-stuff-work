import { GAP, circleFill, line } from "../canvas";
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
		this.el.head = { ...this.el.tail };
	}

	absX() {
		return this.parentNode.el.right - GAP * 3;
	}

	updateTail() {
		this.el.tail = {
			x: (this.absX() + this.parentNode.el.right) / 2,
			y: (this.parentNode.el.y + this.parentNode.el.bottom) / 2
		};
	}

	rectifyPosition() {
		if(this.parentNode.next === null) return;

		const node = this.parentNode.next.el as Node;
		const arrow = new Line(this.el.tail, this.el.head);

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

			if(sideOfRect.doIntersect(arrow)) {
				const o = sideOfRect.pointOfIntersect(arrow);
				this.el.head = o;
				break;
			}
		}
	}

	pointerMove(state: EventState, canvas: CanvasHandler): void {
		let { x, y } = state.pointerMove;

		this.el.head.x = x;
		this.el.head.y = y;

		const el = canvas.finder.except(this).ofTypes(ElementNode.name).find(canvas.elements, x, y);
		
		if(el === null) {
			if(this.parentNode.next) {
				this.parentNode.next.prev = null;
				this.parentNode.next = null;
			}
			canvas.redraw();
			return;
		}

		if(!((el as ElementNode)?.prev)) {
			this.parentNode.next = el as ElementNode;
			this.parentNode.next.prev = this.parentNode;
		}

		this.rectifyPosition();

		canvas.redraw();
	}

	isIntersect(x: number, y: number): null | ElementHandler {
		return this.el.isIntersect(x, y) ? this as any : null;
	}

	draw(canvas: HTMLCanvasElement) {
		const ctx = canvas.getContext("2d");
		if(ctx == null) return;
		const x = this.absX();

		line(ctx, x, this.parentNode.el.y, x, this.parentNode.el.y + Node.height, 3, "#FF0000");
		circleFill(ctx, (x + this.parentNode.el.right) / 2, (this.parentNode.el.y + this.parentNode.el.bottom) / 2, 5);

		if(this.el.head.x < 0) return;

		const { x: fromx, y: fromy } = this.el.tail;
		const { x: tox, y: toy } = this.el.head;
		const headlen = 15;
		const dx = tox - fromx;
		const dy = toy - fromy;
		const angle = Math.atan2(dy, dx);

		if(this.parentNode.next === null) {
			ctx.fillStyle = "#999999";
			ctx.strokeStyle = "#999999";
		} else {
			ctx.fillStyle = "#FFFFFF";
			ctx.strokeStyle = "#FFFFFF";
		}

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


