import { GAP } from "../canvas";
import { Point } from "../geometry";
import { EventState } from "../handler/event-handler";
import { CanvasHandler } from "../handler/canvas-handler";
import { AdjMatrix } from "./element-types/adjacency-matrix";
import { ElementHandler } from "../handler/element-handler";

export class ElementAdjMatrix extends AdjMatrix implements ElementHandler {
	pointerEnter(_state: EventState, _canvas: CanvasHandler) {};
	pointerUp(_state: EventState, _canvas: CanvasHandler): ElementHandler | null { return null };
	pointerLeave(_state: EventState, _canvas: CanvasHandler) {};

	static COUNT = 0;

	readonly id: number;

	constructor(x: number, y: number, value: Array<Array<number>>) {
		super(x, y, value);
		this.x = x;
		this.y = y;
		this.id = ElementAdjMatrix.COUNT;
		ElementAdjMatrix.COUNT++;
	}

	pointerDy: number = -1;
	pointerDx: number = -1;

	rectifyEdges() {
	}

	defaultArrowPointPos(): Point {
		return new Point(this.left + GAP, (this.top + this.bottom) / 2);
	}

	moveTo(x: number, y: number) {
		this.setXY(x, y);
	}

	pointerMove(state: EventState, canvas: CanvasHandler): void {
		if(state.pointerDown.x === -1) return;
		let { x, y } = state.pointerMove;

		x = Math.floor(x / GAP) * GAP - this.pointerDx;
		y = Math.floor(y / GAP) * GAP - this.pointerDy;

		this.moveTo(x, y);

		canvas.redraw();
	}

	remove(canvas: CanvasHandler) {
		canvas.removeElements(this);
	}

	async scrollTo(canvas: CanvasHandler) {
		const x = this.x + canvas.offset.x;
		const y = this.y + canvas.offset.y;
		if(!(x > 0 && x < canvas.width && y > 0 && y < canvas.height)) {
			await canvas.scrollTo(canvas.halfWidth - this.x, canvas.halfHeight - this.y, 30);
		}
	}

	pointerDown(state: EventState): void {
		let { x: nodex, y: nodey } = this;
		let { x: statex, y: statey } = state.pointerDown;
		this.pointerDx = Math.floor((statex - nodex) / GAP) * GAP;
		this.pointerDy = Math.floor((statey - nodey) / GAP) * GAP;
	}

	isIntersect(x: number, y: number, _: Point, canvas: CanvasHandler): null | ElementHandler {
		if(this.intersects(x, y, canvas.offset)) return this;
		return null;
	}

	unfocus() {
		this.resetStyle();
	}

	focus() {
		this.borderColor = "#ffff00";
	}

	draw(ctx: CanvasRenderingContext2D) {
		this.paint(ctx);
	}
}

