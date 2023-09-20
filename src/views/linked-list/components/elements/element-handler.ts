import { GAP, circleFill, line } from "../canvas";
import { Node, ELEMENT, Empty, Arrow } from "../element-types";
import { EventState } from "../playground/event-handler";
import { CanvasHandler } from "../playground/playground-handler";

export class ElementHandler {
	constructor() {}

	el: ELEMENT = new Empty;

	pointerMove(_state: EventState, _canvas: CanvasHandler) {}
	pointerEnter(_state: EventState, _canvas: CanvasHandler) {}
	pointerLeave(_state: EventState, _canvas: CanvasHandler) {}
	pointerDown(_state: EventState, _canvas: CanvasHandler) {}
	pointerUp(_state: EventState, _canvas: CanvasHandler): null | ElementHandler { return null }

	isIntersect(_x: number, _y: number): null | ElementHandler { return null; }

	draw(_canvas: HTMLCanvasElement) {}
}

class Point {
	x: number = 0;
	y: number = 0;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}

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

	pointOfIntersect(A: Point, B: Point, C: Point, D: Point) {
		const a1 = B.y - A.y;
		const b1 = A.x - B.x;
		const c1 = a1*(A.x) + b1*(A.y);

		const a2 = D.y - C.y;
		const b2 = C.x - D.x;
		const c2 = a2*(C.x)+ b2*(C.y);

		const determinant = a1*b2 - a2*b1;

		if (determinant == 0) {
			return new Point(Number.MAX_VALUE, Number.MAX_VALUE);
		} else {
			const x = (b2*c1 - b1*c2)/determinant;
			const y = (a1*c2 - a2*c1)/determinant;
			return new Point(x, y);
		}
	}

	pointerMove(state: EventState, canvas: CanvasHandler): void {
		let { x, y } = state.pointerMove;

		x = Math.floor(x / GAP) * GAP + (GAP / 2);
		y = Math.floor(y / GAP) * GAP + (GAP / 2);

		this.el.head.x = x;
		this.el.head.y = y;

		const el = canvas.finder
							.except(this)
							.ofTypes(ElementNode.name)
							.find(canvas.elements, x, y);
		
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

