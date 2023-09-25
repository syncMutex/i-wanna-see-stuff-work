import { GAP, line } from "../canvas";
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

	async deleteNode(canvas: CanvasHandler) {
		const arrow = this.arrow;

		arrow.el.bg = Arrow.notPointingColor;
		await arrow.animateArrowHeadTo(canvas, new Point(arrow.el.tail.x + GAP, arrow.el.tail.y));

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
				canvas.redraw();
				r.next = this.next;
				next.referedBy.add(r);
			}
		}
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

		if(selectedElement.value === this) {
			ctx.strokeStyle = "#FFF000";
			ctx.lineWidth = 3;
			const wb2 = ctx.lineWidth / 2;
			ctx.strokeRect(x - wb2, y - wb2, Node.width + ctx.lineWidth, Node.height + ctx.lineWidth);
			ctx.lineWidth = 1;
		}

		const divx = this.el.dividerX();
		line(ctx, divx, y, divx, y + Node.height, 3, Node.dividerColor);

		this.arrow.draw(canvas);

		ctx.fillStyle = "#FFFFFF";
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		ctx.font = "16px monospace";
		let text = this.el.value;
		const tlen = text.length;
		if(tlen > 5) {
			text = text.slice(0, 5) + " ";
		}
		ctx.fillText(text, (this.el.left + divx) / 2, (this.el.top + this.el.bottom) / 2);
		if(tlen > 5) {
			ctx.font = "9px monospace";
			ctx.fillText("..", (this.el.left + divx) / 2 + 22, (this.el.top + this.el.bottom) / 2 + 2);
		}
	}
}

