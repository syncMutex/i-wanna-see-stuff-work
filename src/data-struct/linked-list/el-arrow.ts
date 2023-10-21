import { GAP } from "../canvas";
import { Line, Point } from "../geometry";
import { EventState } from "../handler/event-handler";
import { CanvasHandler } from "../handler/canvas-handler";
import { Arrow } from "./element-types/arrow";
import { LLNode } from "./element-types/node";
import { ElementHandler } from "../handler/element-handler";
import { ElementLLNode } from "./el-node";

export class ElementArrow extends Arrow implements ElementHandler {
	parentLLNode: ElementLLNode;

	pointerEnter(_state: EventState, _canvas: CanvasHandler) {};
	pointerLeave(_state: EventState, _canvas: CanvasHandler) {};
	pointerDown(_state: EventState, _canvas: CanvasHandler) {};
	remove(canvas: CanvasHandler) {
		canvas.removeElements(this);
	}
	
	constructor(node: ElementLLNode) {
		super();
		this.parentLLNode = node;
		this.head = { x: this.tail.x + GAP, y: this.tail.y };
	}

	getRectifiedPos(node: LLNode, line: Line) {
		const rectLines = [
			// top
			[new Point(node.left, node.top), new Point(node.right, node.top)],
			// right
			[new Point(node.right, node.top), new Point(node.right, node.bottom)],
			// left
			[new Point(node.left, node.top), new Point(node.left, node.bottom)],
			// bottom
			[new Point(node.left, node.bottom), new Point(node.right, node.bottom)],
		];

		for(let i = 0; i < rectLines.length; i++) {
			const a = rectLines[i][0];
			const b = rectLines[i][1];
			const sideOfRect = new Line(a, b);

			if(sideOfRect.doIntersect(line)) {
				const o = sideOfRect.pointOfIntersect(line);
				return o
			}
		}
		return new Point(-1, -1);
	}

	rectifyHead() {
		if(this.parentLLNode.next === null) return;
		const arrow = new Line(this.tail, this.head);
		this.head = this.getRectifiedPos(this.parentLLNode.next as LLNode, arrow);
	}

	insertAfterLLNode: null | ElementLLNode = null;

	pointerMove(state: EventState, canvas: CanvasHandler): void {
		let { x, y } = state.pointerMove;

		this.head.x = x - canvas.offset.x;
		this.head.y = y - canvas.offset.y;

		const el = canvas.finder
							.except(this.parentLLNode)
							.ofTypes(ElementLLNode.name)
							.find<ElementLLNode>(x, y, canvas);
		
		if(el === null) {
			if(this.parentLLNode.next) {
				this.parentLLNode.next.removeRefs(this.parentLLNode as any);
				this.parentLLNode.next = null;
			}
			if(this.bg !== Arrow.notPointingColor) {
				this.bg = Arrow.notPointingColor;
			}
			canvas.redraw();
			return;
		}

		this.insertAfterLLNode = null;

		for(let r of el.referedBy) {
			const h = r.arrow.head;
			if(h !== this.head && Math.abs(h.x - this.head.x) < 5 && Math.abs(h.y - this.head.y) < 5) {
				this.insertAfterLLNode = r;
				break;
			}
		}

		if(this.insertAfterLLNode) {
			this.bg = Arrow.insertColor;
		} else {
			this.parentLLNode.next = el;
			el.referedBy.add(this.parentLLNode as any);
			this.bg = Arrow.pointingColor;
		}

		this.rectifyHead();
		canvas.redraw();
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

	pointerUp(_state: EventState, canvas: CanvasHandler): ElementHandler | null {
		if(this.bg !== Arrow.insertColor) return null;
		if(this.insertAfterLLNode) {
			this.insertAfterLLNode.insertLLNode(this.parentLLNode as any, canvas);
		}
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

