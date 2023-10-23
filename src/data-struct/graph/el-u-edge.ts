import { Line, Point } from "../geometry";
import { EventState } from "../handler/event-handler";
import { CanvasHandler } from "../handler/canvas-handler";
import { UEdge } from "./element-types/u-edge.ts";
import { ElementHandler } from "../handler/element-handler";
import { ElementGNode } from "./el-node";
import { GNode } from "./element-types/node.ts";
import { selectedElement } from "../global.ts";

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

		this.fromNode.addUEdge(this);
		this.toNode.addUEdge(this);
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

	async deleteEdgeAnimation(canvas: CanvasHandler) {
		const line = new Line(this.start, this.end);
		let p = 0;

		return new Promise<void>((resolve, _reject) => {
			const fn = () => {
				this.start = line.getPositionAlongTheLine(p);
				this.end = line.getPositionAlongTheLine(1 - p);
				p += 0.05;
				canvas.redraw();
				if(p >= 0.5) {
					resolve();
				} else {
					requestAnimationFrame(fn);
				}
			}
			requestAnimationFrame(fn);
		});
	}

	async delete(canvas: CanvasHandler) {
		await this.deleteEdgeAnimation(canvas);
		this.fromNode.edges.delete(this);
		this.toNode.edges.delete(this);
		this.remove(canvas);
	}

	pointerMove(_state: EventState, _canvas: CanvasHandler): void {
	}

	pointerUp(_state: EventState, _canvas: CanvasHandler): ElementHandler | null {
		return null;
	}

	isIntersect(x: number, y: number, offset: Point, canvas: CanvasHandler): null | ElementHandler {
		const ctx = canvas.playgroundCanvas.getContext("2d");
		if(ctx == null) return null;
		return this.intersects(x, y, offset, ctx) ? this as any : null;
	}

	draw(ctx: CanvasRenderingContext2D) {
		if(this === selectedElement.value) {
			this.bg = "#FFFF00";
		} else {
			this.bg = "#FFFFFF";
		}

		this.paint(ctx);
	}
}

