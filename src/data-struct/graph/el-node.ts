import { GAP, circleStroke } from "../canvas";
import { Point } from "../geometry";
import { EventState } from "../handler/event-handler";
import { CanvasHandler } from "../handler/canvas-handler";
import { selectedElement } from "../global";
import { GNode } from "./element-types/node";
import { ElementHandler } from "../handler/element-handler";
import { ElementUEdge } from "./el-u-edge";
import { ElementDEdge } from "./el-d-edge";

export class ElementGNode extends GNode implements ElementHandler {
	edges: Map<ElementUEdge | ElementDEdge, boolean> = new Map();

	pointerEnter(_state: EventState, _canvas: CanvasHandler) {};
	pointerUp(_state: EventState, _canvas: CanvasHandler): ElementHandler | null { return null };
	pointerLeave(_state: EventState, _canvas: CanvasHandler) {};

	constructor(x: number, y: number, value: string) {
		super(value);
		this.x = x;
		this.y = y;
	}

	pointerDy: number = -1;
	pointerDx: number = -1;

	rectifyEdges() {
		this.edges.forEach((_, edge) => edge.rectify())
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

		this.rectifyEdges();

		canvas.redraw();
	}

	addUEdge(e: ElementUEdge) {
		this.edges.set(e, true);
	}

	addDEdge(e: ElementDEdge) {
		this.edges.set(e, true);
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

	isIntersect(x: number, y: number, offset: Point): null | ElementHandler {
		if(this.intersects(x, y, offset)) return this;
		return null;
	}

	drawBorder(ctx: CanvasRenderingContext2D, color: string) {
		ctx.strokeStyle = color;
		ctx.lineWidth = 5;
		circleStroke(ctx, this.x, this.y, GNode.radius);
	}

	draw(canvas: HTMLCanvasElement) {
		const ctx = canvas.getContext("2d");
		if(ctx === null) return;

		if(this === selectedElement.value) {
			this.drawBorder(ctx, "#FFFF00");
		}

		this.paint(ctx);

		for(let edge of this.edges.keys()) {
			edge.draw(canvas);
		}
	}
}

