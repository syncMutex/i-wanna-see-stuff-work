import { GAP } from "../canvas";
import { Line, Point } from "../geometry";
import { EventState } from "../handler/event-handler";
import { CanvasHandler } from "../handler/canvas-handler";
import { selectedElement } from "../global";
import { Arrow } from "./element-types/arrow";
import { Node } from "./element-types/node";
import { ElementArrow } from "./el-arrow";
import { ElementHandler } from "../handler/element-handler";
import { sleep } from "../utils";

export class ElementNode extends Node implements ElementHandler {
	arrow: ElementArrow;

	referedBy: Set<ElementNode> = new Set();
	next: ElementNode | null = null;

	pointerEnter(_state: EventState, _canvas: CanvasHandler) {};
	pointerUp(_state: EventState, _canvas: CanvasHandler): ElementHandler | null { return null };
	pointerLeave(_state: EventState, _canvas: CanvasHandler) {};

	constructor(x: number, y: number, value: string) {
		super(value);
		this.x = x;
		this.y = y;
		this.arrow = new ElementArrow(this);
		this.updateArrowTail();
		this.arrow.head = { x: this.arrow.tail.x + GAP, y: this.arrow.tail.y };
	}

	pointerDy: number = -1;
	pointerDx: number = -1;

	updateArrowTail() {
		this.arrow.tail = {
			x: (this.dividerX() + this.right) / 2,
			y: (this.y + this.bottom) / 2
		};
	}

	updateArrowHead() {
		if(this.next) {
			this.arrow.head.x = this.next.left + GAP;
			this.arrow.head.y = (this.next.top + this.next.bottom) / 2;
			this.arrow.rectifyPosition();
		}
	}

	defaultArrowPointPos(): Point {
		return new Point(this.left + GAP, (this.top + this.bottom) / 2);
	}

	pointerMove(state: EventState, canvas: CanvasHandler): void {
		if(state.pointerDown.x === -1) return;
		let { x, y } = state.pointerMove;
		let { x: prevx, y: prevy } = this;

		x = Math.floor(x / GAP) * GAP - this.pointerDx;
		y = Math.floor(y / GAP) * GAP - this.pointerDy;

		this.setXY(x, y);
		this.arrow.tail.x += x - prevx;
		this.arrow.tail.y += y - prevy;

		this.updateArrowHead();

		if(this.referedBy.size > 0) {
			for(let r of this.referedBy) {
				r.arrow.head.x = this.left + GAP;
				r.arrow.head.y = (this.top + this.bottom) / 2;
				r.arrow.rectifyPosition();
			}
		}

		canvas.redraw();
	}

	remove(canvas: CanvasHandler) {
		canvas.removeElements(this, this.arrow);
	}

	removeRefs(...args: Array<ElementNode>) {
		for(let a of args) {
			this.referedBy.delete(a);
		}
	}

	setNext(next: ElementNode | null) {
		this.next = next;
		if(next === null) {
			this.arrow.bg = Arrow.notPointingColor;
		} else {
			this.arrow.bg = Arrow.pointingColor;
			next.referedBy.add(this);
		}
	}

	async insertNode(toInsertStart: ElementNode, canvas: CanvasHandler) {
		const arrow = this.arrow;
		const toInsertArrow = toInsertStart.arrow;
		const next = this.next;

		if(next === null) throw "next is a null";

		toInsertArrow.bg = Arrow.notPointingColor;
		await toInsertArrow.animateArrowHeadTo(canvas, new Point(toInsertArrow.tail.x + GAP, toInsertArrow.tail.y));

		let rectified = arrow.getRectifiedPos(toInsertStart, new Line(arrow.tail, toInsertStart.defaultArrowPointPos()));
		await arrow.animateArrowHeadTo(canvas, rectified);

		rectified = toInsertArrow.getRectifiedPos(next, new Line(toInsertArrow.tail, next.defaultArrowPointPos()));
		await toInsertArrow.animateArrowHeadTo(canvas, rectified);

		toInsertStart.setNext(next);
		next.removeRefs(this);
		this.setNext(toInsertStart);

		toInsertArrow.bg = Arrow.pointingColor;
		canvas.redraw();
	}

	async deleteNode(canvas: CanvasHandler) {
		const arrow = this.arrow;

		arrow.bg = Arrow.notPointingColor;
		await arrow.animateArrowHeadTo(canvas, new Point(arrow.tail.x + GAP, arrow.tail.y));

		this.remove(canvas);

		if(this.referedBy.size === 0 && this.next === null) {
			this.remove(canvas);
			canvas.redraw();
			return;
		}

		if(this.referedBy.size === 0) {
			this.remove(canvas);
			(this.next as ElementNode).referedBy.delete(this);
			canvas.redraw();
			return;
		}

		const next = this.next;
		if(next === null) {
			for(let r of this.referedBy) {
				r.next = null;
				r.arrow.bg = Arrow.notPointingColor;
			}
		} else {
			for(let r of this.referedBy) {
				r.next = null;
				r.arrow.bg = Arrow.pointingColor;
				let rectified = r.arrow.getRectifiedPos(next, new Line(r.arrow.tail, next.defaultArrowPointPos()));
				await r.arrow.animateArrowHeadTo(canvas, rectified);
				r.next = this.next;
				next.referedBy.add(r);
			}
		}

		canvas.redraw();
	}

	async deleteAllReachable(canvas: CanvasHandler) {
		let node: ElementNode = this;

		while(node) {
			const next = node.next;
			const arrow = node.arrow;

			arrow.bg = Arrow.notPointingColor;
			await arrow.animateArrowHeadTo(canvas, new Point(arrow.tail.x + GAP, arrow.tail.y));

			if(node.referedBy.size === 0 && next === null) {
				node.remove(canvas);
				canvas.redraw();
				return;
			}

			if(next && node.referedBy.size === 0) {
				node.remove(canvas);
				next.referedBy.delete(this);
				node = next;
				continue;
			}

			for(let r of node.referedBy) {
				r.next = null;
				r.arrow.bg = Arrow.notPointingColor;
			}

			node.remove(canvas);
			node = next as ElementNode;
		}

		canvas.redraw();
	}

	static delay = 50;

	static setDelay(d: number) {
		if(d < 1) return;
		ElementNode.delay = d;
	}

	async find(value: string, canvas: CanvasHandler) {
		const ctx = canvas.playgroundCanvas.getContext("2d");
		if(ctx === null) return;
		const visited = new Set<ElementNode>();
		let node: ElementNode | null = this;

		while(node !== null) {
			if(visited.has(node)) {
				break;
			}
			visited.add(node);

			await canvas.scrollTo(canvas.halfWidth - node.x, canvas.halfHeight - node.y, 10);

			node.setBg("#FFFFFF");
			node.color = "#000000";
			node.draw(canvas.playgroundCanvas);

			await sleep(ElementNode.delay);

			if(node.value === value) {
				break;
			}

			node.setBg("#FF0000");
			node.color = "#FFFFFF";
			node.draw(canvas.playgroundCanvas);

			await sleep(ElementNode.delay);

			node.resetStyle();

			canvas.draw();
			node = node.next;
		}

		if(node === null) {
			console.log("not found");
		} else if(node.value !== value) {
			console.log("cycle detected");
		} else {
			node.bg = "#00FF00";
			node.draw(canvas.playgroundCanvas);
			node.resetStyle();
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
		ctx.lineWidth = 3;
		const wb2 = ctx.lineWidth / 2;
		ctx.strokeRect(this.x - wb2, this.y - wb2, Node.width + ctx.lineWidth, Node.height + ctx.lineWidth);
	}

	draw(canvas: HTMLCanvasElement) {
		const ctx = canvas.getContext("2d");
		if(ctx === null) return;

		if(this === selectedElement.value) {
			this.drawBorder(ctx, "#FFFF00");
		}

		this.paint(ctx);
		this.arrow.draw(canvas);
	}
}

