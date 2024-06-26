import { GAP } from "../canvas";
import { Line, Point } from "../geometry";
import { EventState } from "../handler/event-handler";
import { CanvasHandler } from "../handler/canvas-handler";
import { DEdge } from "./element-types/d-edge.ts";
import { GNode } from "./element-types/node";
import { ElementHandler } from "../handler/element-handler";
import { ElementGNode } from "./el-node";
import allocator, { AllocDisplay, Ptr } from "../memory-allocator/allocator.ts";
import { ShallowRef, shallowRef } from "vue";
import { numberToBytes } from "../utils.ts";

export class ElementDEdge extends DEdge implements ElementHandler, AllocDisplay {
	fromNode: ElementGNode;
	toNodePtr: ShallowRef<Ptr<ElementGNode>>;

	get toNode() {
		return this.toNodePtr.value.v;
	}

	pointerEnter(_state: EventState, _canvas: CanvasHandler) {};
	pointerLeave(_state: EventState, _canvas: CanvasHandler) {};
	pointerDown(_state: EventState, _canvas: CanvasHandler) {};

	remove(canvas: CanvasHandler) {
		allocator.free(this.ptr);
		canvas.removeElements(this);
	}

    toBytes(): Array<string> {
		return [
			...numberToBytes(Number(this.weight.value)),
			...this.toNode.ptr.toBytes(),
		];
	}

    toString(): string {
		return ` edge { weight: ${this.weight.value}, to: ${this.toNode.ptr} } `;
	}

    toDisplayableBlocks() {
		return [
			` edge { weight: ${this.weight.value}, to: `,
			{ ptr: this.toNode.ptr.toString() },
			` } `
		];
	}

	ptr: Ptr<ElementDEdge>;

	static Size = 4 + Ptr.Size;
	
	constructor(parent: ElementGNode, to: Ptr<ElementGNode>) {
		super();
		this.fromNode = parent;
		this.toNodePtr = shallowRef(to);

		this.ptr = allocator.malloc(ElementDEdge.Size, this);

		this.fromNode.addDEdge(this.ptr);
		this.toNode.referedByDEdges.add(this);
		this.head = { x: this.tail.x + GAP, y: this.tail.y };
	}

	getToNode(): ElementGNode {
		return this.toNode;
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
		this.fromNode.edges.v.delete(this.ptr);
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

		this.head.x = x - canvas.transform.x;
		this.head.y = y - canvas.transform.y;

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

		const firstEdge = el?.edges.v.first()?.v;
		const isNotPartOfUEdge = !((firstEdge && firstEdge.constructor.name !== ElementDEdge.name))

		if(el && !ElementGNode.hasDEdge(this.fromNode, el) && isNotPartOfUEdge) {
			this.toNode.referedByDEdges.delete(this);
			this.toNodePtr.value = el.ptr;
			el.referedByDEdges.add(this);
		}

		this.rectify();
		canvas.redraw();

		return null;
	}

	isIntersect(x: number, y: number, canvas: CanvasHandler): null | ElementHandler {
		return this.intersects(x, y, canvas.transform, canvas.ctx) ? this as any : null;
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

