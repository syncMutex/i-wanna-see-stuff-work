export const GAP = 10;

export function setCanvasSize(canvas: HTMLCanvasElement, width: number, height: number) {
	let ratio = Math.ceil(window.devicePixelRatio);
	if(canvas === null) return;
	canvas.width = width * ratio;
	canvas.height = height * ratio;
	canvas.style.width = `${width}px`;
	canvas.style.height = `${height}px`;
	canvas.getContext('2d')?.setTransform(ratio, 0, 0, ratio, 0, 0);
}

export interface CanvasSize {
	width: number,
	height: number
}

export function line(
	ctx: CanvasRenderingContext2D,
	x1: number, y1: number,
	x2: number, y2: number,
	width: number, color: string | null = null
) {
	ctx.lineWidth = width;
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	if(color !== null) {
		ctx.strokeStyle = color;
	}
	ctx.stroke();
}

const PI2 = 2 * Math.PI;

export function circleFill(
	ctx: CanvasRenderingContext2D,
	x: number, y: number,
	radius: number, color: string | null =null
) {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, PI2);
	if(color !== null) {
		ctx.strokeStyle = color;
	}
	ctx.fill();
}

export function circleStroke(
	ctx: CanvasRenderingContext2D,
	x: number, y: number,
	radius: number, color: string | null =null
) {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, PI2);
	if(color !== null) {
		ctx.strokeStyle = color;
	}
	ctx.stroke();
}

