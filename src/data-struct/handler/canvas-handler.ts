import { GAP } from "../canvas";
import { Point } from "../geometry";
import { ElementHandler, panHandler } from "./element-handler";

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

	find<T>(x: number, y: number, canvas: CanvasHandler): T | null {
		for(let i = canvas.elements.length - 1; i >= 0; i--) {
			const e = canvas.elements[i].isIntersect(x, y, canvas.offset, canvas);
			if(e && !this.exceptList.includes(e) && this.typeList.includes(e.constructor.name)) {
				return e as T;
 			}
		}
		return null;
	}
}

export class CanvasHandler {
	playgroundCanvas: HTMLCanvasElement;
	toolCanvas: HTMLCanvasElement;
	lineCanvas: HTMLCanvasElement;

	ctx: CanvasRenderingContext2D;
	toolCtx: CanvasRenderingContext2D;
	lineCtx: CanvasRenderingContext2D;

	isDisplayGrid: boolean = true;

	finder: Finder = new Finder();

	elements: Array<ElementHandler> = [];

	width = 0;
	height = 0;

	halfWidth = 0;
	halfHeight = 0;

	offset = { x: 0, y: 0 };
	DPR = 1;

	constructor() {
		this.playgroundCanvas = document.createElement("canvas");
		this.ctx = this.playgroundCanvas.getContext('2d') as CanvasRenderingContext2D;

		this.toolCanvas = document.createElement("canvas");
		this.toolCtx = this.playgroundCanvas.getContext('2d') as CanvasRenderingContext2D;

		this.lineCanvas = document.createElement("canvas");
		this.lineCtx = this.playgroundCanvas.getContext('2d') as CanvasRenderingContext2D;
	}

	init(
		pgndCanvas: HTMLCanvasElement,
		toolCanvas: HTMLCanvasElement,
		lineCanvas: HTMLCanvasElement
	) {
		this.playgroundCanvas = pgndCanvas;
		this.ctx = pgndCanvas.getContext('2d') as CanvasRenderingContext2D;

		this.toolCanvas = toolCanvas;
		this.toolCtx = toolCanvas.getContext('2d') as CanvasRenderingContext2D;

		this.lineCanvas = lineCanvas;
		this.lineCtx = lineCanvas.getContext('2d') as CanvasRenderingContext2D;

		this.DPR = Math.ceil(window.devicePixelRatio);
	}

	setIsDisplayGrid(v: boolean) {
		this.isDisplayGrid = v;
		if(this.isDisplayGrid) {
			this.lineCanvas.style.display = "block";
			this.updateLineCanvas();
		} else {
			this.lineCanvas.style.display = "none";
		}
	}

	setSize(w: number, h: number) {
		this.width = w;
		this.height = h;

		this.halfWidth = Math.floor(w / 2);
		this.halfHeight = Math.floor(h / 2);
	}

	add(...element: Array<ElementHandler>) {
		for(let el of element) {
			this.elements.push(el);
			el.draw(this.ctx);
		}
	}

	removeElements(...args: Array<ElementHandler>) {
		if(args.length === 1) {
			const idx = this.elements.findIndex((e) => e === args[0]);
			if(idx !== -1) {
				this.elements.splice(idx, 1);
			}
		} else {
			this.elements = this.elements.filter(e => !args.includes(e));
		}
	}

	findIntersection(x: number, y: number): ElementHandler | null {
		for(let i = this.elements.length - 1; i >= 0; i--) {
			const e = this.elements[i].isIntersect(x, y, this.offset, this);
			if(e) {
				return e;
			}
		}
		return panHandler;
	}
	
	findIntersectionExcept(x: number, y: number, except: Array<ElementHandler>): ElementHandler | null {
		for(let i = this.elements.length - 1; i >= 0; i--) {
			const e = this.elements[i].isIntersect(x, y, this.offset, this);
			if(e && !except.includes(e)) {
				return e;
			}
		}
		return null;
	}

	findIntersectionOfType(x: number, y: number, ofTypes: Array<string>): ElementHandler | null {
		for(let i = this.elements.length - 1; i >= 0; i--) {
			const e = this.elements[i].isIntersect(x, y, this.offset, this);
			if(e && ofTypes.includes(e.constructor.name)) {
				return e;
			}
		}
		return null;
	}

	updateLineCanvas() {
		if(!this.isDisplayGrid) {
			return;
		}
		const ctx = this.lineCanvas.getContext("2d");
		if(ctx === null) return;

		ctx.clearRect(0, 0, this.width, this.height);

		ctx.strokeStyle = "#505050";

		for(let x = this.offset.x % GAP; x < this.width; x += GAP) {
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, this.height);
			ctx.stroke();
		}

		for(let y = this.offset.y % GAP; y < this.height; y += GAP) {
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(this.width, y);
			ctx.stroke();
		}
	}

	panTo(x: number, y: number) {
		this.offset.x = x;
		this.offset.y = y;
		this.updateLineCanvas();
		this.redraw();
	}

	async scrollTo(x: number, y: number, step: number) {
		return new Promise<void>(resolve => {
			if(step <= 0) {
				this.panTo(x, y);
				return resolve();
			}

			const dx = (x - this.offset.x >= 0) ? 1 : -1;
			const dy = (y - this.offset.y >= 0) ? 1 : -1;
			const magx = dx * step;
			const magy = dy * step;
			const destx = step * Math.floor(x / step);
			const desty = step * Math.floor(y / step);

			const scroll = () => {
				const dx = Math.abs(this.offset.x - destx) > step;
				const dy = Math.abs(this.offset.y - desty) > step;
				if(dx) this.offset.x += magx;
				if(dy) this.offset.y += magy;
				if(!dx && !dy) {
					this.panTo(x, y);
					return resolve();
				}
				this.updateLineCanvas();
				this.redraw();
				window.requestAnimationFrame(scroll);
			}
			scroll();
		})
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
		requestAnimationFrame(this.draw.bind(this));
	}

	draw() {
		for(let i = 0; i < this.elements.length; i++) {
			this.elements[i].draw(this.ctx);
		}
	}
}
