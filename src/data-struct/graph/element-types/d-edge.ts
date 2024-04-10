import { ref } from "vue";
import { Line, Point } from "../../geometry";
import { Transform } from "../../handler/canvas-handler";

export class DEdge {
	head = new Point(-1, -1);
	tail = new Point(-1, -1);

	bg: string | CanvasGradient = "#FFFFFF";

	weight = ref(0);

	static LineWidth = 3;

	paint(ctx: CanvasRenderingContext2D) {
		const { x: fromx, y: fromy } = this.tail;
		const { x: tox, y: toy } = this.head;
		const headlen = 15;
		const dx = tox - fromx;
		const dy = toy - fromy;
		const angle = Math.atan2(dy, dx);

		ctx.lineWidth = DEdge.LineWidth;

		// circleFill(ctx, this.tail.x, this.tail.y, 4, this.bg.toString());

		ctx.fillStyle = this.bg;
		ctx.strokeStyle = this.bg;

		ctx.beginPath();
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(tox, toy);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(tox, toy);
		ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
		ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
		ctx.closePath();
		ctx.stroke();
		ctx.fill();

		if(this.weight.value) {
			ctx.save();

			const angle = Math.atan((toy - fromy) / (tox - fromx));
			const p = new Line(this.tail, this.head).getPositionAlongTheLine(0.5);
			const text = String(this.weight.value);

			ctx.translate(p.x, p.y);

			ctx.rotate(angle);

			ctx.translate(-p.x, -p.y);

			ctx.fillStyle = this.bg;
			ctx.textBaseline = "bottom";
			ctx.textAlign = "center";
			ctx.font = "16px monospace";
			ctx.fillText(text, p.x, p.y);

			ctx.restore();
		}
	}

	intersects(x: number, y: number, transform: Transform, ctx: CanvasRenderingContext2D): boolean {
		ctx.save();
		ctx.lineWidth = 10;
		ctx.resetTransform();
		ctx.translate(transform.x, transform.y);

		const path = new Path2D();

		path.moveTo(this.tail.x, this.tail.y);
		path.lineTo(this.head.x, this.head.y);

		const onLine = ctx.isPointInStroke(path, x, y);

		const { x: fromx, y: fromy } = this.tail;
		const { x: tox, y: toy } = this.head;
		const headlen = 15;
		const dx = tox - fromx;
		const dy = toy - fromy;
		const angle = Math.atan2(dy, dx);
		const p = new Path2D();

		p.moveTo(tox, toy);
		p.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
		p.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
		p.closePath();

		const onTri = ctx.isPointInStroke(p, x, y);

		ctx.restore();

		return onTri || onLine;
	}
}

