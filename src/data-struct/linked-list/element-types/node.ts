import { GAP, line } from "../../canvas";
import { Point } from "../../geometry";
import { Ptr } from "../../memory-allocator/allocator";
import { Str } from "../../memory-allocator/types";

export class LLNode {
	static width = GAP * 9;
	static height = GAP * 3;

	dividerColor: string = "";
	bg: string = "";
	color = "#FFFFFF";

	static halfWidth = (Math.floor((LLNode.width / GAP) / 2) * GAP);
	static halfHeight = (Math.floor((LLNode.height / GAP) / 2) * GAP);

	x = -1;
	y = -1;
	value: Ptr<Str>;

	constructor(value: string) {
		this.value = Str.new(value);
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
		ctx.fillRect(x, y, LLNode.width, LLNode.height);

		const divx = this.dividerX();
		line(ctx, divx, y, divx, y + LLNode.height, 3, this.dividerColor);

		ctx.fillStyle = this.color;
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		ctx.font = "16px monospace";
		let text = this.value.v.chars;
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
		return this.y + LLNode.height;
	}

	get left() {
		return this.x;
	}

	get right() {
		return this.x + LLNode.width;
	}

	intersects(x: number, y: number, offset: Point): boolean {
		const lowx = this.x + offset.x;
		const lowy = this.y + offset.y;
		const highx = lowx + LLNode.width;
		const highy = lowy + LLNode.height;
		return x >= lowx && x <= highx && y >= lowy && y <= highy;
	}
}
