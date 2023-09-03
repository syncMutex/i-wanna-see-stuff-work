import { Tool } from "./tools/tool";

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

export class ElementGroup {
	scroll = { x: 0, y: 0 };
	elements: Array<Tool> = [];
	canvas: null | HTMLCanvasElement = null;

	add(tool: Tool) {
		this.elements.push(tool);
		tool.draw(this.canvas as HTMLCanvasElement);
	}

	draw(canvas: HTMLCanvasElement) {
		for(let i = 0; i < this.elements.length; i++) {
			this.elements[i].draw(canvas);
		}
	}
}

