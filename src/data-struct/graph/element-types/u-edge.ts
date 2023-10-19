import { Line, Point } from "../../geometry";

export class UEdge {
	start = { x: -1, y: -1 };
	end = { x: -1, y: -1 };

	bg: string | CanvasGradient = "#FFFFFF";

	paint(ctx: CanvasRenderingContext2D) {
		const { x: fromx, y: fromy } = this.start;
		const { x: tox, y: toy } = this.end;

		ctx.fillStyle = this.bg;
		ctx.strokeStyle = this.bg;

		ctx.lineWidth = 3;

		ctx.beginPath();
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(tox, toy);
		ctx.stroke();

		// circleFill(ctx, this.start.x, this.start.y, 4);
		// circleFill(ctx, this.end.x, this.end.y, 4);
	}

	checkIntersectOf(x: number, y: number, offset: Point, m: number) {
		const p = new Line(this.start, this.end).getPositionAlongTheLine(m);
		const mag = 10;
		const _x = p.x + offset.x;
		const _y = p.y + offset.y;
		const lowx = _x - mag;
		const lowy = _y - mag;
		const highx = _x + mag;
		const highy = _y + mag;
		return x >= lowx && x <= highx && y >= lowy && y <= highy;
	}

	intersects(_x: number, _y: number, _offset: Point): boolean {
		return false;
	}
}

