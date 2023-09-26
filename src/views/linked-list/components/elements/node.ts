import { GAP } from "../canvas";
import { Arrow, Node } from "../element-types";
import { Line, Point } from "../geometry";
import { EventState } from "../playground/event-handler";
import { CanvasHandler } from "../playground/playground-handler";
import { selectedElement } from "../selected-item";
import { ElementArrow } from "./arrow";
import { ElementHandler } from "./element-handler";

export class ElementNode extends ElementHandler {
	el: Node;
	arrow: ElementArrow;

	referedBy: Set<ElementNode> = new Set();
	next: ElementNode | null = null;

	constructor(node: Node) {
		super();
		this.el = node;
		this.arrow = new ElementArrow(this);
		this.updateArrowTail();
		this.arrow.el.head = { x: this.arrow.el.tail.x + GAP, y: this.arrow.el.tail.y };
		this.arrow.parentNode = this;
	}

	pointerDy: number = -1;
	pointerDx: number = -1;

	updateArrowTail() {
		this.arrow.el.tail = {
			x: ((this.el as Node).dividerX() + this.el.right) / 2,
			y: (this.el.y + this.el.bottom) / 2
		};
	}

	updateArrowHead() {
		if(this.next) {
			this.arrow.el.head.x = this.next.el.left + GAP;
			this.arrow.el.head.y = (this.next.el.top + this.next.el.bottom) / 2;
			this.arrow.rectifyPosition();
		}
	}

	defaultArrowPointPos(): Point {
		return new Point(this.el.left + GAP, (this.el.top + this.el.bottom) / 2);
	}

	pointerMove(state: EventState, canvas: CanvasHandler): void {
		if(state.pointerDown.x === -1) return;
		let { x, y } = state.pointerMove;
		let { x: prevx, y: prevy } = this.el;

		x = Math.floor(x / GAP) * GAP - this.pointerDx;
		y = Math.floor(y / GAP) * GAP - this.pointerDy;

		if(x < 0) x = 0;
		if(y < 0) y = 0;

		this.el.setXY(x, y);
		this.arrow.el.tail.x += x - prevx;
		this.arrow.el.tail.y += y - prevy;

		this.updateArrowHead();

		if(this.referedBy.size > 0) {
			for(let r of this.referedBy) {
				r.arrow.el.head.x = this.el.left + GAP;
				r.arrow.el.head.y = (this.el.top + this.el.bottom) / 2;
				r.arrow.rectifyPosition();
			}
		}

		canvas.redraw();
	}

	remove(canvas: CanvasHandler) {
		canvas.removeElements(this, this.arrow);
	}

	removeRefs(...args: Array<ElementNode>) {
		for(let a of args) {
			this.referedBy.delete(a);
		}
	}

	setNext(next: ElementNode | null) {
		this.next = next;
		if(next === null) {
			this.arrow.el.bg = Arrow.notPointingColor;
		} else {
			this.arrow.el.bg = Arrow.pointingColor;
			next.referedBy.add(this);
		}
	}

	async insertNode(toInsertStart: ElementNode, canvas: CanvasHandler) {
		const arrow = this.arrow;
		const toInsertArrow = toInsertStart.arrow;
		const next = this.next;

		if(next === null) throw "next is a null";

		toInsertArrow.el.bg = Arrow.notPointingColor;
		await toInsertArrow.animateArrowHeadTo(canvas, new Point(toInsertArrow.el.tail.x + GAP, toInsertArrow.el.tail.y));

		let rectified = arrow.getRectifiedPos(toInsertStart.el, new Line(arrow.el.tail, toInsertStart.defaultArrowPointPos()));
		await arrow.animateArrowHeadTo(canvas, rectified);

		rectified = toInsertArrow.getRectifiedPos(next.el, new Line(toInsertArrow.el.tail, next.defaultArrowPointPos()));
		await toInsertArrow.animateArrowHeadTo(canvas, rectified);

		toInsertStart.setNext(next);
		next.removeRefs(this);
		this.setNext(toInsertStart);

		toInsertArrow.el.bg = Arrow.pointingColor;
		canvas.redraw();
	}

	async deleteNode(canvas: CanvasHandler) {
		const arrow = this.arrow;

		arrow.el.bg = Arrow.notPointingColor;
		await arrow.animateArrowHeadTo(canvas, new Point(arrow.el.tail.x + GAP, arrow.el.tail.y));

		this.remove(canvas);

		if(this.referedBy.size === 0 && this.next === null) {
			this.remove(canvas);
			canvas.redraw();
			return;
		}

		if(this.referedBy.size === 0) {
			this.remove(canvas);
			(this.next as ElementNode).referedBy.delete(this);
			canvas.redraw();
			return;
		}

		const next = this.next;
		if(next === null) {
			for(let r of this.referedBy) {
				r.next = null;
				r.arrow.el.bg = Arrow.notPointingColor;
			}
		} else {
			for(let r of this.referedBy) {
				r.next = null;
				r.arrow.el.bg = Arrow.pointingColor;
				let rectified = r.arrow.getRectifiedPos(next.el, new Line(r.arrow.el.tail, next.defaultArrowPointPos()));
				await r.arrow.animateArrowHeadTo(canvas, rectified);
				r.next = this.next;
				next.referedBy.add(r);
			}
		}

		canvas.redraw();
	}

	async deleteAllReachable(canvas: CanvasHandler) {
		let node: ElementNode = this;

		while(node) {
			const next = node.next;
			const arrow = node.arrow;

			arrow.el.bg = Arrow.notPointingColor;
			await arrow.animateArrowHeadTo(canvas, new Point(arrow.el.tail.x + GAP, arrow.el.tail.y));

			if(node.referedBy.size === 0 && next === null) {
				node.remove(canvas);
				canvas.redraw();
				return;
			}

			if(next && node.referedBy.size === 0) {
				node.remove(canvas);
				next.referedBy.delete(this);
				node = next;
				continue;
			}

			for(let r of node.referedBy) {
				r.next = null;
				r.arrow.el.bg = Arrow.notPointingColor;
			}

			node.remove(canvas);
			node = next as ElementNode;
		}

		canvas.redraw();
	}

	wait(ms: number) {
		return new Promise((r) => {
			setTimeout(r, ms);
		});
	}

	delay = 500;

	async find(value: string, canvas: CanvasHandler) {
		const ctx = canvas.playgroundCanvas.getContext("2d");
		if(ctx === null) return;
		const visited = new Set<ElementNode>();
		let node: ElementNode | null = this;

		while(node !== null) {
			if(visited.has(node)) {
				break;
			}
			visited.add(node);

			node.el.setBg("#FFFFFF");
			node.el.color = "#000000";
			node.draw(canvas.playgroundCanvas);

			await this.wait(this.delay);

			node.el.setBg("#03f8fc");
			node.draw(canvas.playgroundCanvas);

			await this.wait(this.delay);

			if(node.el.value === value) {
				break;
			}

			node.el.setBg("#FF0000");
			node.el.color = "#FFFFFF";
			node.draw(canvas.playgroundCanvas);

			await this.wait(this.delay);

			node.el.resetStyle();

			canvas.redraw();
			node = node.next;
		}

		if(node === null) {
			console.log("not found");
		} else if(node.el.value !== value) {
			console.log("cycle detected");
		} else {
			node.el.bg = "#00FF00";
			node.draw(canvas.playgroundCanvas);
			node.el.resetStyle();
		}
	}

	pointerDown(state: EventState): void {
		let { x: nodex, y: nodey } = this.el;
		let { x: statex, y: statey } = state.pointerDown;
		this.pointerDx = Math.floor((statex - nodex) / GAP) * GAP;
		this.pointerDy = Math.floor((statey - nodey) / GAP) * GAP;
	}

	isIntersect(x: number, y: number): null | ElementHandler {
		if(this.el.isIntersect(x, y)) return this;
		return null;
	}

	drawBorder(ctx: CanvasRenderingContext2D, color: string) {
		ctx.strokeStyle = color;
		ctx.lineWidth = 3;
		const wb2 = ctx.lineWidth / 2;
		ctx.strokeRect(this.el.x - wb2, this.el.y - wb2, Node.width + ctx.lineWidth, Node.height + ctx.lineWidth);
	}

	draw(canvas: HTMLCanvasElement) {
		const ctx = canvas.getContext("2d");
		if(ctx === null) return;

		if(this === selectedElement.value) {
			this.drawBorder(ctx, "#FFFF00");
		}

		this.el.draw(ctx);
		this.arrow.draw(canvas);
	}
}

