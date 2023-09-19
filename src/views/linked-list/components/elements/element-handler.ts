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

class ElementArrow {
	arrow: Arrow;
	parentNode: Node;
	
	constructor(node: Node) {
		this.arrow = new Arrow();
		this.parentNode = node;
		this.updateTail();
		this.arrow.head = { ...this.arrow.tail };
	}

	absX() {
		return this.parentNode.right - GAP * 3;
	}
	
	updateTail() {
		this.arrow.tail = {
			x: (this.absX() + this.parentNode.right) / 2,
			y: (this.parentNode.y + this.parentNode.bottom) / 2
		};
	}

	pointerMove(state: EventState, canvas: CanvasHandler): void {
		let { x, y } = state.pointerMove;

		x = Math.floor(x / GAP) * GAP + (GAP / 2);
		y = Math.floor(y / GAP) * GAP + (GAP / 2);

		this.arrow.head.x = x;
		this.arrow.head.y = y;

		canvas.clear();
		canvas.draw();
	}

	isIntersect(x: number, y: number): boolean {
		return this.arrow.isIntersect(x, y);
	}

	draw(ctx: CanvasRenderingContext2D) {
		const x = this.absX();

		line(ctx, x, this.parentNode.y, x, this.parentNode.y + Node.height, 3, "#FF0000");
		circleFill(ctx, (x + this.parentNode.right) / 2, (this.parentNode.y + this.parentNode.bottom) / 2, 5);

		if(this.arrow.head.x < 0) return;

		const { x: fromx, y: fromy } = this.arrow.tail;
		const { x: tox, y: toy } = this.arrow.head;
		const headlen = 15;
		const dx = tox - fromx;
		const dy = toy - fromy;
		const angle = Math.atan2(dy, dx);

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
}

export class ElementNode extends ElementHandler {
	element: Node;
	arrow: ElementArrow;
	next: ElementNode | null = null;
	prev: ElementNode | null = null;
	isHandleArrow: boolean = false;

	constructor(node: Node) {
		super();
		this.element = node;
		this.arrow = new ElementArrow(node);
	}

	isSelected = false;
	pointerDy: number = -1;
	pointerDx: number = -1;

	pointerUp(_state: EventState, _canvas: CanvasHandler): void {
		if(this.isHandleArrow) this.isHandleArrow = false;
	}

	pointerMove(state: EventState, canvas: CanvasHandler): void {
		if(this.isHandleArrow) {
			this.arrow.pointerMove(state, canvas);
			return;
		}
		if(state.pointerDown.x === -1) return;
		let { x, y } = state.pointerMove;

		x = Math.floor(x / GAP) * GAP - this.pointerDx;
		y = Math.floor(y / GAP) * GAP - this.pointerDy;

		this.element.setXY(x, y);
		this.arrow.updateTail();

		canvas.clear();
		canvas.draw();
	}

	pointerDown(state: EventState): void {
		let { x: nodex, y: nodey } = this.element;
		let { x: statex, y: statey } = state.pointerDown;
		this.pointerDx = Math.floor((statex - nodex) / GAP) * GAP;
		this.pointerDy = Math.floor((statey - nodey) / GAP) * GAP;
		if(this.arrow.isIntersect(statex, statey)) {
			this.isHandleArrow = true;
		}
	}

	isIntersect(x: number, y: number): boolean {
		return this.element.isIntersect(x, y) || this.arrow.isIntersect(x, y);
	}

	draw(canvas: HTMLCanvasElement) {
		const ctx = canvas.getContext("2d");
		if(ctx === null) return;

		ctx.fillStyle = "#FFFF00";
		ctx.fillRect(this.element.x, this.element.y, Node.width, Node.height);

		this.arrow.draw(ctx);
	}
}

