import { ElementHandler } from "./element-handler";
import { ToolHandler } from "./tool-handler";
import { CanvasHandler } from "./canvas-handler";
import { ToolList } from "../global";

export class Playground {
	canvas: CanvasHandler = new CanvasHandler();
	toolHandler: ToolHandler | null = null;
	elementHandler: ElementHandler | null  = null;

	resizeCanvas(width: number, height: number) {
		this.canvas.setSize(width, height);
		this.canvas.redraw();
		this.canvas.updateLineCanvas();
	}

	init(pgndCanvas: HTMLCanvasElement, toolCanvas: HTMLCanvasElement, lineCanvas: HTMLCanvasElement) {
		this.canvas.init(pgndCanvas, toolCanvas, lineCanvas);
		// window.show = () => console.log(this.canvas.elements);
	}

	setTool(toolIdx: number) {
		if(toolIdx < 0) {
			this.toolHandler = null;
			return;
		}
		this.toolHandler = new ToolList[toolIdx].toolClass();
	}
}

export const playground = new Playground();
