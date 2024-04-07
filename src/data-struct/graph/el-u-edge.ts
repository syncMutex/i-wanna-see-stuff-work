import { Line, Point } from "../geometry";
import { EventState } from "../handler/event-handler";
import { CanvasHandler } from "../handler/canvas-handler";
import { UEdge } from "./element-types/u-edge.ts";
import { ElementHandler } from "../handler/element-handler";
import { ElementGNode } from "./el-node";
import { GNode } from "./element-types/node.ts";
import allocator, { AllocDisplay, Ptr } from "../memory-allocator/allocator.ts";
import { ShallowReactive, ShallowRef, shallowRef } from "vue";
import { numberToBytes } from "../utils.ts";

export class ElementUEdge extends UEdge implements ElementHandler, AllocDisplay {
	pointerEnter(_state: EventState, _canvas: CanvasHandler) {}
	pointerLeave(_state: EventState, _canvas: CanvasHandler) {}

	pointerDown(state: EventState, canvas: CanvasHandler) {
		let p = state.pointerDown;
		p = canvas.toVirtualPosition(p.x, p.y);

		if(new Line(p, this.start).distance() < new Line(p, this.end).distance()) {
			this.toMoveEnd = this.start;
			this.toMoveNode = this.toNode;
		} else {
			this.toMoveEnd = this.end;
			this.toMoveNode = this.fromNode;
		}
	}

	remove(canvas: CanvasHandler) {
		allocator.free(this.ptr);
		canvas.removeElements(this);
	}

	fromNodeRef: ShallowRef<Ptr<ElementGNode>>;
	toNodeRef: ShallowRef<Ptr<ElementGNode>>;

	get toNode() {
		return this.toNodeRef.value.v;
	}

	get fromNode() {
		return this.fromNodeRef.value.v;
	}

	toMoveEnd: Point = new Point(-1, -1);
	toMoveNode: ElementGNode | null = null;

	ptr: ShallowReactive<Ptr<ElementUEdge>>;

	getToNode(node: ElementGNode): ElementGNode {
		return this.toNode === node ? this.fromNode : this.toNode;
	}

    toBytes(): Array<string> {
		return [
			...numberToBytes(Number(this.weight.value)),
			...this.fromNode.ptr.toBytes(),
			...this.toNode.ptr.toBytes()
		]
	}

    toString(): string {
		return ` edge { weight: ${this.weight.value}, n1: ${this.fromNode.ptr}, n2: ${this.toNode.ptr} } `;
	}

    toDisplayableBlocks() {
		return [
			` edge { weight: ${this.weight.value}, n1: `,
			{ ptr: this.fromNode.ptr.toString() },
			` n2: `,
			{ ptr: this.toNode.ptr.toString() },
			` } `
		];
	}

	static Size = 4 + Ptr.Size + Ptr.Size;
	
	constructor(fromNode: Ptr<ElementGNode>, toNode: Ptr<ElementGNode>) {
		super();

		this.fromNodeRef = shallowRef(fromNode);
		this.toNodeRef = shallowRef(toNode);

		this.start = { x: fromNode.v.x, y: fromNode.v.y };
		this.end = { x: toNode.v.x, y: toNode.v.y };

		this.ptr = allocator.malloc(ElementUEdge.Size, this);

		this.fromNode.addUEdge(this.ptr);
		this.toNode.addUEdge(this.ptr);
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
		this.fromNode.edges.v.delete(this.ptr);
		this.toNode.edges.v.delete(this.ptr);
		this.remove(canvas);
	}

	pointerMove(state: EventState, canvas: CanvasHandler): void {
		if(state.pointerDown.x === -1) return; 
		let { x, y } = state.pointerMove;

		this.toMoveEnd.x = x - canvas.offset.x;
		this.toMoveEnd.y = y - canvas.offset.y;

		const rStart = this.doRectifyFor(this.toMoveNode as ElementGNode, this.toMoveEnd);

		if(rStart) {
			const e = this.toMoveEnd === this.start ? this.end : this.start;
			e.x = rStart.x;
			e.y = rStart.y;
		}

		canvas.redraw();
	}

	pointerUp(state: EventState, canvas: CanvasHandler): ElementHandler | null {
		const { x, y } = state.pointerUp;

		if(state.pointerDown.x === x && state.pointerDown.y === y) {
			return this;
		}
		const el = canvas.finder
						.ofTypes(ElementGNode.name)
						.except(this.fromNode, this.toNode)
						.find<ElementGNode | null>(x, y, canvas);

		if(el && !ElementGNode.hasUEdge(this.toMoveNode as ElementGNode, el)) {
			this.fromNode.edges.v.delete(this.ptr);
			this.toNode.edges.v.delete(this.ptr);
			this.fromNodeRef.value = (this.toMoveNode as ElementGNode).ptr;

			this.fromNodeRef.value = (this.toMoveNode as ElementGNode).ptr;
			this.toNodeRef.value = el.ptr;

			this.fromNode.addUEdge(this.ptr);
			this.toNode.addUEdge(this.ptr);
		}

		this.start = { x: this.fromNode.x, y: this.fromNode.y };
		this.end = { x: this.toNode.x, y: this.toNode.y };

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

