import { GAP, circleFill, line } from "../../canvas";
import { Point } from "../../geometry";

export class Node {
	static width = GAP * 9;
	static height = GAP * 3;

	dividerColor: string = "";
	bg: string = "";
	color = "#FFFFFF";

	static halfWidth = (Math.floor((Node.width / GAP) / 2) * GAP);
	static halfHeight = (Math.floor((Node.height / GAP) / 2) * GAP);

	x = -1;
	y = -1;
	value: string = "";

	constructor(value: string) {
		this.value = value;
		this.setBg("#8400ff");
	}

	setBg(bg: string) {
		this.bg = bg;
		const r = Math.round(parseInt(bg.slice(1, 3), 16) * 0.65);
		const g = Math.round(parseInt(bg.slice(3, 5), 16) * 0.65);
		const b = Math.round(parseInt(bg.slice(5, 7), 16) * 0.65);

		this.dividerColor = `rgb(${r}, ${g}, ${b})`;
	}

	resetStyle() {
		this.setBg("#8400ff");
		this.color = "#FFFFFF";
	}

	paint(ctx: CanvasRenderingContext2D) {
		const { x, y } = this;

		ctx.fillStyle = this.bg;
		ctx.fillRect(x, y, Node.width, Node.height);

		const divx = this.dividerX();
		line(ctx, divx, y, divx, y + Node.height, 3, this.dividerColor);
		circleFill(ctx, (this.dividerX() + this.right) / 2, (this.y + this.bottom) / 2, 4, "#FFFFFF");

		ctx.fillStyle = this.color;
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		ctx.font = "16px monospace";
		let text = this.value;
		const tlen = text.length;
		if(tlen > 5) {
			text = text.slice(0, 5) + " ";
		}
		ctx.fillText(text, (this.left + divx) / 2, (this.top + this.bottom) / 2);
		if(tlen > 5) {
			ctx.font = "9px monospace";
			ctx.fillText("..", (this.left + divx) / 2 + 22, (this.top + this.bottom) / 2 + 2);
		}
	}

	setXY(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	dividerX() {
		return this.right - GAP * 3;
	}
	
	get top() {
		return this.y;
	}

	get bottom() {
		return this.y + Node.height;
	}

	get left() {
		return this.x;
	}

	get right() {
		return this.x + Node.width;
	}

	intersects(x: number, y: number, offset: Point): boolean {
		const lowx = this.x + offset.x;
		const lowy = this.y + offset.y;
		const highx = lowx + Node.width;
		const highy = lowy + Node.height;
		return x >= lowx && x <= highx && y >= lowy && y <= highy;
	}
}
