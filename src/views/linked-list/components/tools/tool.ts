import { GAP, setCanvasSize } from "../canvas";

export class Tool {
	x: number = -1;
	y: number = -1;
	width: number = -1;
	height: number = -1;

	constructor() {
	}

	setXY(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	setSize(width: number, height: number) {
		this.width = width;
		this.height = height;
	}

	draw(_canvas: HTMLCanvasElement) {
	}

	toCursorCanvas(_canvas: HTMLCanvasElement) {
	}
}

export class Node extends Tool {
	constructor() {
		super();
		this.width = GAP * 10;
		this.height = GAP * 10;
		this.setSize(this.width, this.height);
	}

	draw(canvas: HTMLCanvasElement) {
		const ctx = canvas.getContext("2d");
		if(ctx === null) return;

		ctx.fillStyle = "#FF0000";
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}

	toCursorCanvas(canvas: HTMLCanvasElement) {
		setCanvasSize(canvas, this.width, this.height);
		const ctx = canvas.getContext("2d");
		if(ctx === null) return;

		ctx.fillStyle = "#FFFF00";
		ctx.fillRect(0, 0, this.width, this.height);
	}
}

export class Arrow extends Tool {
	constructor() {
		super();
		this.width = GAP * 10;
		this.height = GAP * 10;
		this.setSize(this.width, this.height);
	}
}
