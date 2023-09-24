import { GAP, line } from "../canvas";
import { Arrow, Node } from "../element-types";
import { Line, Point } from "../geometry";
import { EventState } from "../playground/event-handler";
import { CanvasHandler } from "../playground/playground-handler";
import { ElementArrow } from "./arrow";
import { ElementHandler } from "./element-handler";

export class ElementNode extends ElementHandler {
	el: Node;
	arrow: ElementArrow;

	prev: ElementNode | null = null;
	next: ElementNode | null = null;

	constructor(node: Node) {
		super();
		this.el = node;
		this.arrow = new ElementArrow(this);
		this.arrow.parentNode = this;
	}

	pointerDy: number = -1;
	pointerDx: number = -1;

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

		if(this.next) {
			this.arrow.el.head.x = this.next.el.left + GAP;
			this.arrow.el.head.y = (this.next.el.top + this.next.el.bottom) / 2;
			this.arrow.rectifyPosition();
		}

		if(this.prev) {
			this.prev.arrow.el.head.x = this.el.left + GAP;
			this.prev.arrow.el.head.y = (this.el.top + this.el.bottom) / 2;
			this.prev.arrow.rectifyPosition();
		}

		canvas.redraw();
	}

	remove(canvas: CanvasHandler) {
		canvas.removeElements(this, this.arrow);
	}

	async deleteNode(canvas: CanvasHandler) {
		const arrow = this.arrow;

		arrow.el.bg = Arrow.notPointingColor;
		await arrow.animateArrowHeadTo(canvas, new Point(arrow.el.tail.x + GAP, arrow.el.tail.y));

		if(this.prev === null && this.next === null) {
			this.remove(canvas);
			canvas.redraw();
			return;
		}

		let prev = this.prev;
		if(prev === null) {
			this.remove(canvas);
			(this.next as ElementNode).prev = null;
			canvas.redraw();
			return;
		}

		const prevArrow = prev.arrow;

		if(this.next === null) {
			this.remove(canvas);
			if(this.prev) {
				this.prev.next = null;
				this.prev.arrow.el.bg = Arrow.notPointingColor;
			}
			canvas.redraw();
			return;
		}

		let rectified = prevArrow.getRectifiedPos(this.next.el, new Line(prevArrow.el.tail, this.next.defaultArrowPointPos()));
		await prevArrow.animateArrowHeadTo(canvas, rectified);

		prev.next = this.next;
		this.next.prev = prev;
		this.remove(canvas);
		canvas.redraw();
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

	draw(canvas: HTMLCanvasElement) {
		const ctx = canvas.getContext("2d");
		if(ctx === null) return;

		const { x, y } = this.el;

		ctx.fillStyle = Node.bg;
		ctx.fillRect(x, y, Node.width, Node.height);

		const divx = this.el.dividerX();
		line(ctx, divx, y, divx, y + Node.height, 3, Node.dividerColor);

		this.arrow.draw(canvas);

		ctx.fillStyle = "#FFFFFF";
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		ctx.font = "16px monospace";
		let text = this.el.value;
		const tlen = text.length;
		if(tlen > 4) {
			text = text.slice(0, 4) + " ";
		}
		ctx.fillText(text, (this.el.left + divx) / 2, (this.el.top + this.el.bottom) / 2);
		if(tlen > 4) {
			ctx.font = "9px monospace";
			ctx.fillText("...", (this.el.left + divx) / 2 + 20, (this.el.top + this.el.bottom) / 2 + 2);
		}
	}
}

export class ElementHeadNode extends ElementNode {
	draw(canvas: HTMLCanvasElement) {
		const ctx = canvas.getContext("2d");
		if(ctx === null) return;

		const { x, y } = this.el;

		ctx.fillStyle = Node.head.bg;
		ctx.fillRect(x, y, Node.width, Node.height);

		const divx = this.el.dividerX();
		line(ctx, divx, y, divx, y + Node.height, 3, Node.head.dividerColor);

		this.arrow.draw(canvas);

		ctx.fillStyle = "#FFFFFF";
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		ctx.font = "16px monospace";
		let text = this.el.value;
		const tlen = text.length;
		if(tlen > 4) {
			text = text.slice(0, 4) + " ";
		}
		ctx.fillText(text, (this.el.left + divx) / 2, (this.el.top + this.el.bottom) / 2);
		if(tlen > 4) {
			ctx.font = "9px monospace";
			ctx.fillText("...", (this.el.left + divx) / 2 + 20, (this.el.top + this.el.bottom) / 2 + 2);
		}
	}
}
