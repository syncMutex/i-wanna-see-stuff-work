import { GAP } from "../canvas";
import { Node } from "../element-types";
import { EventState } from "../playground/event-handler";
import { CanvasHandler } from "../playground/playground-handler";

export class ElementHandler {
	constructor() {}

	pointerMove(_state: EventState, _canvas: CanvasHandler) {}
	pointerEnter(_state: EventState, _canvas: CanvasHandler) {}
	pointerLeave(_state: EventState, _canvas: CanvasHandler) {}
	pointerDown(_state: EventState, _canvas: CanvasHandler) {}
	pointerUp(_state: EventState, _canvas: CanvasHandler) {}

	isIntersect(_x: number, _y: number): boolean { return false; }

	draw(_canvas: HTMLCanvasElement) {}
}

export class ElementNode extends ElementHandler {
	node: Node;
	constructor(node: Node) {
		super();
		this.node = node;
	}

	isSelected = false;

	dy: number = -1;
	dx: number = -1;

	pointerMove(state: EventState, canvas: CanvasHandler): void {
		if(state.pointerDown.x === -1) return;
		let { x, y } = state.pointerMove;

		x = Math.floor(x / GAP) * GAP - this.dx;
		y = Math.floor(y / GAP) * GAP - this.dy;

		this.node.setXY(x, y);

		canvas.clear();
		canvas.draw();
	}

	pointerDown(state: EventState): void {
		let { x: nodex, y: nodey } = this.node;
		let { x: statex, y: statey } = state.pointerDown;
		this.dx = Math.floor((statex - nodex) / GAP) * GAP;
		this.dy = Math.floor((statey - nodey) / GAP) * GAP;
	}

	isIntersect(x: number, y: number): boolean {
		const lowx = this.node.x;
		const lowy = this.node.y;
		const highx = this.node.x + Node.width;
		const highy = this.node.y + Node.height;
		return x >= lowx && x <= highx && y >= lowy && y <= highy;
	}

	draw(canvas: HTMLCanvasElement) {
		const ctx = canvas.getContext("2d");
		if(ctx === null) return;

		ctx.fillStyle = "#FFFF00";
		ctx.fillRect(this.node.x, this.node.y, Node.width, Node.height);
	}
}

