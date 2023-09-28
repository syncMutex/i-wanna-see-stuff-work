import { ToolList } from "./common-utils";
import { ElementHandler } from "./element-handler";
import { ToolHandler } from "./tool-handler";

class Finder {
	private exceptList: Array<ElementHandler> = [];
	private typeList: Array<string> = [];

	except(...args: Array<ElementHandler>) {
		this.exceptList = args;
		return this;
	}

	ofTypes(...args: Array<string>) {
		this.typeList = args;
		return this;
	}

	find<T>(elements: Array<ElementHandler>, x: number, y: number): T | null {
		for(let i = elements.length - 1; i >= 0; i--) {
			const e = elements[i].isIntersect(x, y);
			if(e && !this.exceptList.includes(e) && this.typeList.includes(e.constructor.name)) {
				return e as T;
 			}
		}
		return null;
	}
}

export class CanvasHandler {
	playgroundCanvas: HTMLCanvasElement = document.createElement("canvas");
	toolCanvas: HTMLCanvasElement = document.createElement("canvas");

	finder: Finder = new Finder();

	scroll = { x: 0, y: 0 };
	elements: Array<ElementHandler> = [];

	add(...element: Array<ElementHandler>) {
		for(let el of element) {
			this.elements.push(el);
			el.draw(this.playgroundCanvas);
		}
	}

	removeElements(...args: Array<ElementHandler>) {
		if(args.length === 1) {
			args[0].remove(this);
		} else {
			this.elements = this.elements.filter(e => !args.includes(e));
		}
	}

	findIntersection(x: number, y: number): ElementHandler | null {
		for(let i = this.elements.length - 1; i >= 0; i--) {
			const e = this.elements[i].isIntersect(x, y);
			if(e) {
				return e;
			}
		}
		return null;
	}
	
	findIntersectionExcept(x: number, y: number, except: Array<ElementHandler>): ElementHandler | null {
		for(let i = this.elements.length - 1; i >= 0; i--) {
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

	redraw() {
		this.clear();
		this.draw();
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

export const playground = new Playground();
