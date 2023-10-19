import { Point } from "../geometry";
import { EventState } from "../handler/event-handler";
import { CanvasHandler } from "../handler/canvas-handler";
import { UEdge } from "./element-types/u-edge.ts";
import { ElementHandler } from "../handler/element-handler";
import { ElementGNode } from "./el-node";
import { GNode } from "./element-types/node.ts";

export class ElementUEdge extends UEdge implements ElementHandler {
	pointerEnter(_state: EventState, _canvas: CanvasHandler) {};
	pointerLeave(_state: EventState, _canvas: CanvasHandler) {};
	pointerDown(_state: EventState, _canvas: CanvasHandler) {};
	remove(canvas: CanvasHandler) {
		canvas.removeElements(this);
	}

	fromNode: ElementGNode;
	toNode: ElementGNode;
	
	constructor(fromNode: ElementGNode, toNode: ElementGNode) {
		super();

		this.fromNode = fromNode;
		this.toNode = toNode;

		this.start = { x: fromNode.x, y: fromNode.y };
		this.end = { x: toNode.x, y: toNode.y };

		fromNode.addUEdge(this);
		toNode.addUEdge(this);
	}

	doRectifyFor(node: ElementGNode, end: Point) {
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

	rectify() {
		const rStart = this.doRectifyFor(this.fromNode, this.end);
		const rEnd = this.doRectifyFor(this.toNode, this.start);

		if(rStart) {
			this.start = rStart;
		}

		if(rEnd) {
			this.end = rEnd;
		}
	}

	insertAfterNode: null | ElementGNode = null;

	pointerMove(_state: EventState, _canvas: CanvasHandler): void {
	}

	pointerUp(_state: EventState, _canvas: CanvasHandler): ElementHandler | null {
		return null;
	}

	isIntersect(x: number, y: number, offset: Point): null | ElementHandler {
		return this.intersects(x, y, offset) ? this as any : null;
	}

	draw(canvas: HTMLCanvasElement) {
		const ctx = canvas.getContext("2d");
		if(ctx == null) return;

		this.paint(ctx);
	}
}

