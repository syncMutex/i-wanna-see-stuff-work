import { ToolList } from "./common-utils";
import { ElementHandler, Empty } from "./element-handler";
import { Point } from "./geometry";
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

	find<T>(elements: Array<ElementHandler>, x: number, y: number, offset: Point): T | null {
		for(let i = elements.length - 1; i >= 0; i--) {
			const e = elements[i].isIntersect(x, y, offset);
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

	elements: Array<ElementHandler> = [];

	offset = { x: 0, y: 0 };
	DPR = 1;

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
			const e = this.elements[i].isIntersect(x, y, this.offset);
			if(e) {
				return e;
			}
		}
		return new Empty;
	}
	
	findIntersectionExcept(x: number, y: number, except: Array<ElementHandler>): ElementHandler | null {
		for(let i = this.elements.length - 1; i >= 0; i--) {
			const e = this.elements[i].isIntersect(x, y, this.offset);
			if(e && !except.includes(e)) {
				return e;
			}
		}
		return null;
	}

	async scrollTo(x: number, y: number, step: number) {
		if(step <= 0) {
			this.offset.x = x;
			this.offset.y = y;
			this.redraw();
			return;
		}

		const dx = (x - this.offset.x >= 0) ? 1 : -1;
		const dy = (y - this.offset.y >= 0) ? 1 : -1;
		const magx = dx * step;
		const magy = dy * step;
		const destx = step * Math.floor(x / step);
		const desty = step * Math.floor(y / step);

		const scroll = () => {
			if(this.offset.x !== destx) this.offset.x += magx;
			if(this.offset.y !== desty) this.offset.y += magy;
			if(this.offset.x === destx && this.offset.y === desty) {
				this.offset.x = x;
				this.offset.y = y;
				this.redraw();
				return;
			}
			this.redraw();
			window.requestAnimationFrame(scroll);
		}
		scroll();
	}

	toVirtualPosition(x: number, y: number) {
		return new Point(x - this.offset.x, y - this.offset.y);
	}

	setTransform(ctx: CanvasRenderingContext2D) {
		// please don't ask why am I multiplying dpr to translates
		ctx.setTransform(this.DPR, 0, 0, this.DPR, this.offset.x * this.DPR, this.offset.y * this.DPR);
	}

	resetTransform(ctx: CanvasRenderingContext2D) {
		ctx.setTransform(this.DPR, 0, 0, this.DPR, 0, 0);
	}

	clear() {
		const ctx = this.playgroundCanvas.getContext("2d");
		if(ctx === null) return;

		this.resetTransform(ctx);

		ctx.clearRect(0, 0, this.playgroundCanvas.width, this.playgroundCanvas.height);

		// line(ctx, this.offset.x, 0, this.offset.x, this.playgroundCanvas.height, 2, "#FF0000");
		// line(ctx, 0, this.offset.y, this.playgroundCanvas.width, this.offset.y, 2, "#FF0000");

		this.setTransform(ctx);
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

	init(pgndCanvas: HTMLCanvasElement, toolCanvas: HTMLCanvasElement, toolIdx: number) {
		this.canvas.playgroundCanvas = pgndCanvas;
		this.canvas.toolCanvas = toolCanvas;
		this.setTool(toolIdx);
		this.canvas.DPR = Math.ceil(window.devicePixelRatio);
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
