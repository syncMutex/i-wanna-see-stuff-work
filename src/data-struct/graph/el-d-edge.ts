import { GAP } from "../canvas";
import { Point } from "../geometry";
import { EventState } from "../handler/event-handler";
import { CanvasHandler } from "../handler/canvas-handler";
import { DEdge } from "./element-types/d-edge.ts";
import { GNode } from "./element-types/node";
import { ElementHandler } from "../handler/element-handler";
import { ElementGNode } from "./el-node";

export class ElementDEdge extends DEdge implements ElementHandler {
	parentNode: ElementGNode;

	pointerEnter(_state: EventState, _canvas: CanvasHandler) {};
	pointerLeave(_state: EventState, _canvas: CanvasHandler) {};
	pointerDown(_state: EventState, _canvas: CanvasHandler) {};
	remove(canvas: CanvasHandler) {
		canvas.removeElements(this);
	}
	
	constructor(node: ElementGNode) {
		super();
		this.parentNode = node;
		this.head = { x: this.tail.x + GAP, y: this.tail.y };
	}

	doRectifyFor(node: ElementGNode, end: Point) {
		if(node === null) return;

		const r = GNode.radius;
		const { x: x0, y: y0 } = node;
		const { x: x1, y: y1 } = end;
		const { x: h, y: k } = node;

		const x1mx0 = x1 - x0;
		const y1my0 = y1 - y0;
		const x0mh = x0 - h;
		const y0mk = y0 - k;

		const a = x1mx0 * x1mx0 + y1my0 * y1my0; 
		const b = 2 * x1mx0 * x0mh + 2 * y1my0 * y0mk;
		const c = x0mh * 2 + y0mk * 2 - (r * r);

		const d = b * b - 4 * a * c;

		if(d < 0) return;
		
		// replaced + with - 
		//                   ---|
		//                      v
		const t = (2 * c) / (-b - Math.sqrt(d));
		const x = x1mx0 * t + x0;
		const y = y1my0 * t + y0;

		return { x, y };
	}

	delete() {
	}

	rectify() {
	}

	insertAfterNode: null | ElementGNode = null;

	pointerMove(state: EventState, canvas: CanvasHandler): void {
		let { x, y } = state.pointerMove;

		this.head.x = x - canvas.offset.x;
		this.head.y = y - canvas.offset.y;

		canvas.redraw();
	}

	pointerUp(_state: EventState, _canvas: CanvasHandler): ElementHandler | null {
		return null;
	}

	isIntersect(x: number, y: number, offset: Point): null | ElementHandler {
		return this.intersects(x, y, offset) ? this as any : null;
	}

	draw(ctx: CanvasRenderingContext2D) {
		this.paint(ctx);
	}
}

