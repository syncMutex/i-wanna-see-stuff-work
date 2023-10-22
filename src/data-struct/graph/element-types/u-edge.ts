import { Line, Point } from "../../geometry";

export class UEdge {
	start = new Point(-1, -1);
	end = new Point(-1, -1);

	bg: string | CanvasGradient = "#FFFFFF";

	weight = 1234567890;

	static LineWidth = 3;

	paint(ctx: CanvasRenderingContext2D) {
		const { x: fromx, y: fromy } = this.start;
		const { x: tox, y: toy } = this.end;

		ctx.fillStyle = this.bg;
		ctx.strokeStyle = this.bg;

		ctx.lineWidth = UEdge.LineWidth;

		ctx.beginPath();
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(tox, toy);
		ctx.stroke();

		if(this.weight !== 0) {
			ctx.save();

			const angle = Math.atan((toy - fromy) / (tox - fromx));
			const p = new Line(this.start, this.end).getPositionAlongTheLine(0.5);
			const text = String(this.weight);

			ctx.translate(p.x, p.y);

			ctx.rotate(angle);

			ctx.translate(-p.x, -p.y);

			ctx.fillStyle = "#FFFFFF";
			ctx.textBaseline = "bottom";
			ctx.textAlign = "center";
			ctx.font = "16px monospace";
			ctx.fillText(text, p.x, p.y);

			ctx.restore();
		}

		// circleFill(ctx, this.start.x, this.start.y, 4);
		// circleFill(ctx, this.end.x, this.end.y, 4);
	}

	intersects(x: number, y: number, offset: Point, ctx: CanvasRenderingContext2D): boolean {
		ctx.save();
		ctx.lineWidth = 10;
		ctx.resetTransform();
		ctx.translate(offset.x, offset.y);

		const path = new Path2D();

		path.moveTo(this.start.x, this.start.y);
		path.lineTo(this.end.x, this.end.y);

		const ret = ctx.isPointInStroke(path, x, y);

		ctx.restore();

		return ret;
	}
}

