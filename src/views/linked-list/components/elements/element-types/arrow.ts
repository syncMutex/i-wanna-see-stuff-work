import { Line } from "../../geometry";

export class Arrow {
	head = { x: -1, y: -1 };
	tail = { x: -1, y: -1 };

	static notPointingColor = "#AAAAAA";
	static pointingColor = "#FFFFFF";
	static insertColor = "#FFFF00"
	static invalidInsert = "#FF0000";

	bg: string = Arrow.notPointingColor;

	paint(ctx: CanvasRenderingContext2D) {
		const { x: fromx, y: fromy } = this.tail;
		const { x: tox, y: toy } = this.head;
		const headlen = 15;
		const dx = tox - fromx;
		const dy = toy - fromy;
		const angle = Math.atan2(dy, dx);

		ctx.fillStyle = this.bg;
		ctx.strokeStyle = this.bg;

		ctx.beginPath();
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(tox, toy);
		ctx.stroke();

		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.moveTo(tox, toy);
		ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
		ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
	}

	intersects(x: number, y: number): boolean {
		const p = new Line(this.tail, this.head).getPositionAlongTheLine(0.98);
		const mag = 10;
		const lowx = p.x - mag;
		const lowy = p.y - mag;
		const highx = p.x + mag;
		const highy = p.y + mag;
		return x >= lowx && x <= highx && y >= lowy && y <= highy;
	}
}

