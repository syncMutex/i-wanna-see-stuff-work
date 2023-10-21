import { ElementHandler } from "./element-handler";
import { ToolHandler } from "./tool-handler";
import { CanvasHandler } from "./canvas-handler";
import { setCanvasSize } from "../canvas";
import { ToolList } from "../global";

export class Playground {
	canvas: CanvasHandler = new CanvasHandler();
	toolHandler: ToolHandler | null = null;
	elementHandler: ElementHandler | null  = null;

	resizeCanvas(width: number, height: number) {
		this.canvas.setSize(width, height);

		setCanvasSize(this.canvas.playgroundCanvas, width, height);
		setCanvasSize(this.canvas.lineCanvas, width, height);
		this.canvas.redraw();
		this.canvas.updateLineCanvas();
	}

	init(
		pgndCanvas: HTMLCanvasElement,
		toolCanvas: HTMLCanvasElement,
		lineCanvas: HTMLCanvasElement
	) {
		this.canvas.playgroundCanvas = pgndCanvas;
		this.canvas.toolCanvas = toolCanvas;
		this.canvas.lineCanvas = lineCanvas;
		this.canvas.DPR = Math.ceil(window.devicePixelRatio);
		window.show = () => console.log(this.canvas.elements);
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
