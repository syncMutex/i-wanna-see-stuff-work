import { GAP, setCanvasSize } from "../canvas";
import { EventState } from "../playground/event-handler";
import { Playground } from "../playground/playground-handler";

export class Tool {
	x: number = -1;
	y: number = -1;

	constructor() {
	}

	setXY(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	pointerMove(_p: Playground, _s: EventState) {
	}

	pointerEnter(_p: Playground) {
	}

	pointerLeave(_p: Playground) {
	}

	pointerDown(_p: Playground, _s: EventState) {
	}

	pointerUp(_p: Playground, _s: EventState) {
	}

	draw(_canvas: HTMLCanvasElement) {
	}
}

export class Node extends Tool {
	static width = GAP * 10;
	static height = GAP * 5;

	static halfWidth = (Math.floor((Node.width / GAP) / 2) * GAP);
	static halfHeight = (Math.floor((Node.height / GAP) / 2) * GAP);

	constructor() {
		super();
	}

	pointerDown(pgnd: Playground, state: EventState): void {
		// const node = new Node();
		// let { x, y } = state.pointerMove;

		// x = Math.floor(x / GAP) * GAP - Node.halfWidth;
		// y = Math.floor(y / GAP) * GAP - Node.halfHeight;
		// node.setXY(x, y);
		// pgnd.add(node);
	}

	pointerUp(pgnd: Playground, state: EventState): void {
		if(state.pointerDown.y !== state.pointerUp.y || state.pointerUp.x !== state.pointerDown.x) return;
		const node = new Node();
		let { x, y } = state.pointerUp;

		x = Math.floor(x / GAP) * GAP - Node.halfWidth;
		y = Math.floor(y / GAP) * GAP - Node.halfHeight;
		node.setXY(x, y);
		pgnd.add(node);
	}

	pointerEnter(playground: Playground): void {
		if(playground.toolCanvas === null) return;
		setCanvasSize(playground.toolCanvas, Node.width, Node.height);
		this.drawAt(playground.toolCanvas, 0, 0);
	}

	pointerMove(pgnd: Playground, state: EventState) {
		if(pgnd.toolCanvas === null) return;
		let { x, y } = state.pointerMove;

		x = Math.floor(x / GAP) * GAP - Node.halfWidth;
		y = Math.floor(y / GAP) * GAP - Node.halfHeight;

		pgnd.toolCanvas.style.top = y + "px";
		pgnd.toolCanvas.style.left = x + "px";
	}

	pointerLeave(playground: Playground): void {
		if(playground.toolCanvas === null) return;
		playground.toolCanvas.width = 0;
		playground.toolCanvas.height = 0;
	}

	drawAt(canvas: HTMLCanvasElement, x: number, y: number) {
		const ctx = canvas.getContext("2d");
		if(ctx === null) return;

		ctx.fillStyle = "#FFFF00";
		ctx.fillRect(x, y, Node.width, Node.height);
	}

	draw(canvas: HTMLCanvasElement) {
		this.drawAt(canvas, this.x, this.y);
	}
}

export class Arrow extends Tool {
	constructor() {
		super();
	}
}
