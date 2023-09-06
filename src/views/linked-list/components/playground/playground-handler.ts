import { ToolList } from "../common-utils";
import { Tool } from "../tools/tool";

export class Playground {
	scroll = { x: 0, y: 0 };
	elements: Array<Tool> = [];
	playgroundCanvas: null | HTMLCanvasElement = null;
	toolCanvas: null | HTMLCanvasElement = null;
	tool: Tool | null = null;

	setTool(toolIdx: number) {
		if(toolIdx < 0) {
			this.tool = null;
			return;
		}
		this.tool = new ToolList[toolIdx].toolClass();
	}

	add(element: Tool) {
		this.elements.push(element);
		element.draw(this.playgroundCanvas as HTMLCanvasElement);
	}

	draw(canvas: HTMLCanvasElement) {
		for(let i = 0; i < this.elements.length; i++) {
			this.elements[i].draw(canvas);
		}
	}
}

