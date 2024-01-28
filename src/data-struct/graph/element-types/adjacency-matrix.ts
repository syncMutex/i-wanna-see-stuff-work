import { GAP } from "../../canvas";
import { Point } from "../../geometry";

export class AdjMatrix {
	rows: number;
	columns: number;

	x: number;
	y: number;

	static bg: string = "#ff00ff";
	static cellColor: string = "#ffffff";

	borderColor = "#ffffff";

	mat: Array<Array<number>>;

	constructor(x: number, y: number, mat: Array<Array<number>>) {
		this.mat = mat;
		this.rows = mat.length;
		this.columns = mat[0]?.length || 0;
		this.x = x;
		this.y = y;
	}

	paint(ctx: CanvasRenderingContext2D) {
		const left = this.left;
		const top = this.top;
		// border
		ctx.strokeStyle = this.borderColor;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.roundRect(left, top, this.width, this.height, 5);
		ctx.stroke();

		// display dimensions
		const dimStr = `${this.rows}x${this.columns}`;
		const strH = 12;
		const strW = dimStr.length * strH;

		ctx.beginPath();
		ctx.fillStyle = "#7703fc";
		ctx.roundRect(left - strW / 2, top - strH / 2 - 4, strW, 18, 4);
		ctx.fill();

		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		ctx.font = `${strH}px monospace`;
		ctx.fillStyle = "#ffffff";
		ctx.fillText(dimStr, this.x, this.y);

		// draw cells
		let x;
		let y = this.y + 1 + GAP;

		ctx.fillStyle = AdjMatrix.cellColor;

		for(let i = 0; i < this.rows; i++, y += GAP) {
			x = this.x + 1 + GAP;
			for(let j = 0; j < this.columns; j++, x += GAP) {
				ctx.fillRect(x, y, GAP - 2, GAP - 2);
			}
		}
	}

	resetStyle() {
		this.borderColor = "#ffffff";
	}

	setXY(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	get width() {
		return this.columns * GAP + GAP * 2;
	}

	get height() {
		return this.rows * GAP + GAP * 2;
	}
	
	get top() {
		return this.y;
	}

	get bottom() {
		return this.y + this.height + GAP * 2;
	}

	get left() {
		return this.x;
	}

	get right() {
		return this.x + this.width + GAP * 2;
	}

	intersects(x: number, y: number, offset: Point): boolean {
		const lowx = this.x + offset.x;
		const lowy = this.y + offset.y;
		const highx = lowx + this.width;
		const highy = lowy + this.height;
		return x >= lowx && x <= highx && y >= lowy && y <= highy;
	}
}
