import { GAP, circleFill, circleStroke } from "../../canvas";
import { Line, Point } from "../../geometry";
import { Ptr } from "../../memory-allocator/allocator";
import { Str } from "../../memory-allocator/types";

export class GNode {
	public static radius = GAP * 5 / 2 + (GAP / 2);

	bg: string = "";
	color = "#ffffff";
	borderColor = "";

	x = -1;
	y = -1;
	value: Ptr<Str>;

	constructor(value: string) {
		this.value = Str.new(value);
		this.bg = "#ff801f";
	}

	setStyle(bg?: string, color?: string, borderColor?: string) {
		this.bg = bg || this.bg;
		this.color = color || this.color;
		this.borderColor = borderColor || this.borderColor;
		return this;
	}

	resetStyle() {
		this.bg = "#ff801f";
		this.color = "#FFFFFF";
		this.borderColor = "";
		return this;
	}

	paint(ctx: CanvasRenderingContext2D) {
		const { x, y } = this;

		ctx.fillStyle = this.bg;
		circleFill(ctx, x, y, GNode.radius);

		ctx.fillStyle = this.color;
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		ctx.font = "16px monospace";
		let text = this.value.v.chars;
		const tlen = text.length;
		if(tlen > 5) {
			text = text.slice(0, 5) + " ";
		}
		ctx.fillText(text, this.x, this.y);
		if(tlen > 5) {
			ctx.font = "9px monospace";
			ctx.fillText("..", this.x + 22, this.y + 2);
		}

		if(this.borderColor !== "") {
			ctx.strokeStyle = this.borderColor;
			ctx.lineWidth = 3;
			circleStroke(ctx, this.x, this.y, GNode.radius);
		}
	}

	setXY(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	get top() {
		return this.y;
	}

	get bottom() {
		return this.y + GNode.radius;
	}

	get left() {
		return this.x;
	}

	get right() {
		return this.x + GNode.radius;
	}

	intersects(x: number, y: number, {x: ox, y: oy}: Point): boolean {
		return new Line(
			new Point(this.x + ox, this.y + oy),
			new Point(x, y)
		).distance() < GNode.radius;
	}
}
