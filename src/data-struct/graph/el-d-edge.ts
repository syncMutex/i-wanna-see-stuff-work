import { GAP } from "../canvas";
import { Line, Point } from "../geometry";
import { EventState } from "../handler/event-handler";
import { CanvasHandler } from "../handler/canvas-handler";
import { DEdge } from "./element-types/d-edge.ts";
import { GNode } from "./element-types/node";
import { ElementHandler } from "../handler/element-handler";
import { ElementGNode } from "./el-node";

export class ElementDEdge extends DEdge implements ElementHandler {
	fromNode: ElementGNode;
	toNode: ElementGNode;

	pointerEnter(_state: EventState, _canvas: CanvasHandler) {};
	pointerLeave(_state: EventState, _canvas: CanvasHandler) {};
	pointerDown(_state: EventState, _canvas: CanvasHandler) {};
	remove(canvas: CanvasHandler) {
		canvas.removeElements(this);
	}
	
	constructor(parent: ElementGNode, to: ElementGNode) {
		super();
		this.fromNode = parent;
		this.toNode = to;

		this.fromNode.addDEdge(this);
		this.toNode.referedByDEdges.add(this);
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

	async animateArrowHeadTo(canvas: CanvasHandler, to: Point) {
		const line = new Line(this.head, to);
		let p = 0;

		return new Promise<void>((resolve, _reject) => {
			const fn = () => {
				this.head = line.getPositionAlongTheLine(p);
				p += 0.1;
				canvas.redraw();
				if(p >= 1) {
					this.head = line.getPositionAlongTheLine(1);
					resolve();
				} else {
					requestAnimationFrame(fn);
				}
			}
			requestAnimationFrame(fn);
		});
	}

	async delete(canvas: CanvasHandler) {
		await this.animateArrowHeadTo(canvas, this.fromNode);
		this.fromNode.edges.delete(this);
		this.toNode.referedByDEdges.delete(this);
		this.remove(canvas);
	}

	rectify() {
		const rStart = this.doRectifyFor(this.fromNode, this.toNode);
		const rEnd = this.doRectifyFor(this.toNode, this.fromNode);

		if(rStart) {
			this.tail = rStart;
		}

		if(rEnd) {
			this.head = rEnd;
		}
	}

	equals(e: ElementDEdge): boolean {
		return this.toNode === e.toNode;
	}

	insertAfterNode: null | ElementGNode = null;

	pointerMove(state: EventState, canvas: CanvasHandler): void {
		if(state.pointerDown.x === -1) return; 
		let { x, y } = state.pointerMove;

		this.head.x = x - canvas.offset.x;
		this.head.y = y - canvas.offset.y;

		const rStart = this.doRectifyFor(this.fromNode, this.head);

		if(rStart) {
			this.tail = rStart;
		}

		canvas.redraw();
	}

	pointerUp(state: EventState, canvas: CanvasHandler): ElementHandler | null {
		const { x, y } = state.pointerUp;

		if(state.pointerDown.x === x && state.pointerDown.y === y) {
			return this;
		}

		const el = canvas.finder.ofTypes(ElementGNode.name)
								.except(this.fromNode, this.toNode)
								.find<ElementGNode | null>(x, y, canvas);

		if(el && !ElementGNode.hasDEdge(this.fromNode, el)) {
			this.toNode.referedByDEdges.delete(this);
			this.toNode = el;
			el.referedByDEdges.add(this);
		}

		this.rectify();
		canvas.redraw();

		return null;
	}

	isIntersect(x: number, y: number, offset: Point, canvas: CanvasHandler): null | ElementHandler {
		return this.intersects(x, y, offset, canvas.ctx) ? this as any : null;
	}

	focus() {
		this.bg = "#ffff00";
	}

	unfocus() {
		this.bg = "#ffffff";
	}

	draw(ctx: CanvasRenderingContext2D) {
		this.paint(ctx);
	}
}

