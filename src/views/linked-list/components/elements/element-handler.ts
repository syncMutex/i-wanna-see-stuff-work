import { GAP, circleFill, line } from "../canvas";
import { Node, ELEMENT, Empty, Arrow } from "../element-types";
import { EventState } from "../playground/event-handler";
import { CanvasHandler } from "../playground/playground-handler";

export class ElementHandler {
	constructor() {}

	element: ELEMENT = new Empty;

	pointerMove(_state: EventState, _canvas: CanvasHandler) {}
	pointerEnter(_state: EventState, _canvas: CanvasHandler) {}
	pointerLeave(_state: EventState, _canvas: CanvasHandler) {}
	pointerDown(_state: EventState, _canvas: CanvasHandler) {}
	pointerUp(_state: EventState, _canvas: CanvasHandler) {}

	isIntersect(_x: number, _y: number): boolean { return false; }

	draw(_canvas: HTMLCanvasElement) {}
}

export class ElementNode extends ElementHandler {
	element: Node;
	arrow: Arrow;
	isHandleArrow: boolean = false;

	constructor(node: Node) {
		super();
		this.element = node;

		this.arrow = new Arrow();
	}

	isSelected = false;

	pointerDy: number = -1;
	pointerDx: number = -1;

	get arrowX() {
		return this.element.right - GAP * 3;
	}

	get tail() {
		const x = this.arrowX;
		return { x: (x + this.element.right) / 2, y: (this.element.y + this.element.bottom) / 2 };
	}

	handleArrow(state: EventState, canvas: CanvasHandler) {
		let { x, y } = state.pointerMove;

		x = Math.floor(x / GAP) * GAP + (GAP / 2);
		y = Math.floor(y / GAP) * GAP + (GAP / 2);

		this.arrow.tail = this.tail;
		this.arrow.head.x = x;
		this.arrow.head.y = y;

		canvas.clear();
		canvas.draw();
	}

	pointerUp(_state: EventState, _canvas: CanvasHandler): void {
		if(this.isHandleArrow) this.isHandleArrow = false;
	}

	pointerMove(state: EventState, canvas: CanvasHandler): void {
		if(this.isHandleArrow) {
			this.handleArrow(state, canvas);
			return;
		}
		if(state.pointerDown.x === -1) return;
		let { x, y } = state.pointerMove;

		x = Math.floor(x / GAP) * GAP - this.pointerDx;
		y = Math.floor(y / GAP) * GAP - this.pointerDy;

		this.element.setXY(x, y);
		this.arrow.tail = this.tail;

		canvas.clear();
		canvas.draw();
	}

	pointerDown(state: EventState): void {
		let { x: nodex, y: nodey } = this.element;
		let { x: statex, y: statey } = state.pointerDown;
		this.pointerDx = Math.floor((statex - nodex) / GAP) * GAP;
		this.pointerDy = Math.floor((statey - nodey) / GAP) * GAP;
		if(statex > this.arrowX) {
			this.isHandleArrow = true;
		}
	}

	isIntersect(x: number, y: number): boolean {
		const lowx = this.element.x;
		const lowy = this.element.y;
		const highx = this.element.x + Node.width;
		const highy = this.element.y + Node.height;
		return x >= lowx && x <= highx && y >= lowy && y <= highy;
	}

	drawArrow(ctx: CanvasRenderingContext2D) {
		const fromx = this.arrow.tail.x;
		const fromy = this.arrow.tail.y;
		const tox = this.arrow.head.x;
		const toy = this.arrow.head.y;
		const headlen = 15;
		const dx = tox - fromx;
		const dy = toy - fromy;
		const angle = Math.atan2(dy + 5, dx + 5);

		ctx.fillStyle = "#FFFFFF";
		ctx.strokeStyle = "#FFFFFF";

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

	draw(canvas: HTMLCanvasElement) {
		const ctx = canvas.getContext("2d");
		if(ctx === null) return;

		ctx.fillStyle = "#FFFF00";
		ctx.fillRect(this.element.x, this.element.y, Node.width, Node.height);

		const x = this.arrowX;

		line(ctx, x, this.element.y, x, this.element.y + Node.height, 3, "#FF0000");
		circleFill(ctx, (x + this.element.right) / 2, (this.element.y + this.element.bottom) / 2, 5);

		if(this.arrow.head.x > 0) {
			this.drawArrow(ctx);
		}
	}
}

