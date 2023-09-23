import { GAP, line } from "../canvas";
import { Node } from "../element-types";
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

	pointerMove(state: EventState, canvas: CanvasHandler): void {
		if(state.pointerDown.x === -1) return;
		let { x, y } = state.pointerMove;
		let { x: prevx, y: prevy } = this.el;

		x = Math.floor(x / GAP) * GAP - this.pointerDx;
		y = Math.floor(y / GAP) * GAP - this.pointerDy;

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

	pointerDown(state: EventState): void {
		let { x: nodex, y: nodey } = this.el;
		let { x: statex, y: statey } = state.pointerDown;
		this.pointerDx = Math.floor((statex - nodex) / GAP) * GAP;
		this.pointerDy = Math.floor((statey - nodey) / GAP) * GAP;
	}

	isIntersect(x: number, y: number): null | ElementHandler {
		if(this.arrow.isIntersect(x, y)) return this.arrow;
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
