import { GAP } from "../canvas";
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

		if(this.prev) {
			this.prev.arrow.el.head.x += x - prevx;
			this.prev.arrow.el.head.y += y - prevy;
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

		ctx.fillStyle = "#FFFF00";
		ctx.fillRect(this.el.x, this.el.y, Node.width, Node.height);

		this.arrow.draw(canvas);
	}
}
