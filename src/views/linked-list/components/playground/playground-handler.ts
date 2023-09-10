import { ToolList } from "../common-utils";
import { ElementHandler } from "../elements/element-handler";
import { ToolHandler } from "../tools/tool-handler";
import { EventHandler } from "./event-handler";

export class CanvasHandler {
	playgroundCanvas: HTMLCanvasElement = document.createElement("canvas");
	toolCanvas: HTMLCanvasElement = document.createElement("canvas");

	scroll = { x: 0, y: 0 };
	elements: Array<ElementHandler> = [];

	add(element: ElementHandler) {
		this.elements.push(element);
		element.draw(this.playgroundCanvas);
	}

	draw(canvas: HTMLCanvasElement) {
		for(let i = 0; i < this.elements.length; i++) {
			this.elements[i].draw(canvas);
		}
	}
}

export class Playground {
	canvas: CanvasHandler = new CanvasHandler();
	toolHandler: ToolHandler | null = null;
	itemHandler: ElementHandler | null  = null;
	eventHandler: EventHandler = new EventHandler();

	setTool(toolIdx: number) {
		if(toolIdx < 0) {
			this.toolHandler = null;
			return;
		}
		this.toolHandler = new ToolList[toolIdx].toolClass();
	}
}

