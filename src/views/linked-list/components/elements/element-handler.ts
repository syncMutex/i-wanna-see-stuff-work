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
	pointerUp(_state: EventState, _canvas: CanvasHandler): null | ElementHandler { return null }

	isIntersect(_x: number, _y: number): null | ElementHandler { return null; }

	draw(_canvas: HTMLCanvasElement) {}
}

export class ElementArrow extends ElementHandler {
	el: Arrow;
	parentNode: Node;
	
	constructor(node: Node) {
		super();
		this.el = new Arrow();
		this.parentNode = node;
		this.updateTail();
		this.el.head = { ...this.el.tail };
	}

	absX() {
		return this.parentNode.right - GAP * 3;
	}
	
	updateTail() {
		this.el.tail = {
			x: (this.absX() + this.parentNode.right) / 2,
			y: (this.parentNode.y + this.parentNode.bottom) / 2
		};
	}

	pointerMove(state: EventState, canvas: CanvasHandler): void {
		let { x, y } = state.pointerMove;

		x = Math.floor(x / GAP) * GAP + (GAP / 2);
		y = Math.floor(y / GAP) * GAP + (GAP / 2);

		this.el.head.x = x;
		this.el.head.y = y;

		const el = canvas.findIntersectionExcept(x, y, [this]);
		
		if(el === null) {
			canvas.clear();
			canvas.draw();
			return;
		}

		console.log(el);

		canvas.clear();
		canvas.draw();
	}

	isIntersect(x: number, y: number): null | ElementHandler {
		return this.el.isIntersect(x, y) ? this as any : null;
	}

	draw(canvas: HTMLCanvasElement) {
		const ctx = canvas.getContext("2d");
		if(ctx == null) return;
		const x = this.absX();

		line(ctx, x, this.parentNode.y, x, this.parentNode.y + Node.height, 3, "#FF0000");
		circleFill(ctx, (x + this.parentNode.right) / 2, (this.parentNode.y + this.parentNode.bottom) / 2, 5);

		if(this.el.head.x < 0) return;

		const { x: fromx, y: fromy } = this.el.tail;
		const { x: tox, y: toy } = this.el.head;
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
	el: Node;
	arrow: ElementArrow;
	next: ElementNode | null = null;
	prev: ElementNode | null = null;

	constructor(node: Node, arrow: ElementArrow) {
		super();
		this.el = node;
		this.arrow = arrow;
	}

	pointerDy: number = -1;
	pointerDx: number = -1;

	pointerMove(state: EventState, canvas: CanvasHandler): void {
		if(state.pointerDown.x === -1) return;
		let { x, y } = state.pointerMove;

		x = Math.floor(x / GAP) * GAP - this.pointerDx;
		y = Math.floor(y / GAP) * GAP - this.pointerDy;

		this.el.setXY(x, y);
		this.arrow.updateTail();

		canvas.clear();
		canvas.draw();
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

