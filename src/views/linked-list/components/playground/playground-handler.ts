import { ToolList } from "../common-utils";
import { ElementHandler } from "../elements/element-handler";
import { ToolHandler } from "../tools/tool-handler";

export class CanvasHandler {
	playgroundCanvas: HTMLCanvasElement = document.createElement("canvas");
	toolCanvas: HTMLCanvasElement = document.createElement("canvas");

	scroll = { x: 0, y: 0 };
	elements: Array<ElementHandler> = [];

	add(element: ElementHandler) {
		this.elements.push(element);
		element.draw(this.playgroundCanvas);
	}

	findIntersection(x: number, y: number): ElementHandler | null {
		for(let i = 0; i < this.elements.length; i++) {
			const e = this.elements[i].isIntersect(x, y);
			if(e) {
				return e;
			}
		}
		return null;
	}
	
	findIntersectionExcept(x: number, y: number, except: Array<ElementHandler>): ElementHandler | null {
		for(let i = 0; i < this.elements.length; i++) {
			const e = this.elements[i].isIntersect(x, y);
			if(e && !except.includes(e)) {
				return e;
			}
		}
		return null;
	}

	clear() {
		const ctx = this.playgroundCanvas.getContext("2d");
		if(ctx === null) return;
		ctx.clearRect(0, 0, this.playgroundCanvas.width, this.playgroundCanvas.height);
	}

	draw() {
		for(let i = 0; i < this.elements.length; i++) {
			this.elements[i].draw(this.playgroundCanvas);
		}
	}
}

export class Playground {
	canvas: CanvasHandler = new CanvasHandler();
	toolHandler: ToolHandler | null = null;
	elementHandler: ElementHandler | null  = null;

	setTool(toolIdx: number) {
		if(toolIdx < 0) {
			this.toolHandler = null;
			return;
		}
		this.toolHandler = new ToolList[toolIdx].toolClass();
	}
}

