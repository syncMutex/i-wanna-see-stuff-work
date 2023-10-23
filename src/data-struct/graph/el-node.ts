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
	edges: Map<ElementUEdge | ElementDEdge, null> = new Map();

	referedByDEdges: Set<ElementDEdge> = new Set();

	static COUNT = 0;

	pointerEnter(_state: EventState, _canvas: CanvasHandler) {};
	pointerUp(_state: EventState, _canvas: CanvasHandler): ElementHandler | null { return null };
	pointerLeave(_state: EventState, _canvas: CanvasHandler) {};

	readonly id: number;

	constructor(x: number, y: number, value: string) {
		super(value);
		this.x = x;
		this.y = y;
		this.id = ElementGNode.COUNT;
		ElementGNode.COUNT++;
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

		this.edges.forEach((_, edge) => edge.rectify())

		for(let e of this.referedByDEdges) {
			e.rectify();
		}

		canvas.redraw();
	}

	static hasUEdge(n1: ElementGNode, n2: ElementGNode): boolean {
		for(let edge of n1.edges.keys() as IterableIterator<ElementUEdge>) {
			if(
				(edge.fromNode === n1 && edge.toNode === n2) ||
				(edge.toNode === n1 && edge.fromNode === n2)
			) {
				return true;
			}
		}
		return false;
	}

	static hasDEdge(from: ElementGNode, to: ElementGNode): boolean {
		for(let edge of from.edges.keys() as IterableIterator<ElementDEdge>) {
			if(edge.to === to) {
				return true;
			}
		}
		return false;
	}

	addUEdge(e: ElementUEdge) {
		this.edges.set(e, null);
	}

	addDEdge(e: ElementDEdge) {
		this.edges.set(e, null);
	}

	remove(canvas: CanvasHandler) {
		canvas.removeElements(this);
	}

	async deleteNode(canvas: CanvasHandler) {
		for(let edge of this.edges.keys()) {
			await edge.delete(canvas);
			canvas.removeElements(edge);
		}
		
		for(let edge of this.referedByDEdges) {
			await edge.delete(canvas);
			canvas.removeElements(edge);
		}

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

	draw(ctx: CanvasRenderingContext2D) {
		if(this === selectedElement.value) {
			this.drawBorder(ctx, "#FFFF00");
		}

		this.paint(ctx);

		for(let edge of this.edges.keys()) {
			edge.draw(ctx);
		}
	}
}

