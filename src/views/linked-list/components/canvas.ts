export const GAP = 10;

export function setCanvasSize(canvas: HTMLCanvasElement, width: number, height: number) {
	const ratio = Math.ceil(window.devicePixelRatio);
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

