import { GAP } from "../canvas";
import { Point } from "../geometry";
import { EventState } from "../handler/event-handler";
import { CanvasHandler } from "../handler/canvas-handler";
import { AdjMatrix, CELL_SIZE, CellType, EventType } from "./element-types/adjacency-matrix";
import { ElementHandler } from "../handler/element-handler";
import allocator, { AllocDisplay, Dealloc, Ptr } from "../memory-allocator/allocator";
import { numberToBytes } from "../utils";

export class ElementAdjMatrix extends AdjMatrix implements ElementHandler, AllocDisplay, Dealloc {
	pointerEnter(_state: EventState, _canvas: CanvasHandler) {};
	pointerLeave(_state: EventState, _canvas: CanvasHandler) {};

	static COUNT = 0;
	static Size = 4 + 4 + 4;

	readonly id: number;

	ptr: Ptr<ElementAdjMatrix>;

	constructor(x: number, y: number, value: Array<Array<number>>) {
		super(x, y, value);
		this.x = x;
		this.y = y;
		this.id = ElementAdjMatrix.COUNT;
		this.ptr = allocator.malloc(ElementAdjMatrix.Size, this);
		ElementAdjMatrix.COUNT++;
	}

    toBytes(): Array<string> {
		return [
			...numberToBytes(this.rows),
			...numberToBytes(this.columns),
			...this.mat.toBytes()
		]
	}

    toString(): string {
		return ` mat { rows: ${this.rows}, columns: ${this.columns}, mat: ${this.mat} } `;
	}

    toDisplayableBlocks() {
		return [` mat { rows: ${this.rows}, columns: ${this.columns}, mat: `, { ptr: this.mat.toString() }, ` } `];
	}

	dealloc() {
		for(let m of this.mat.v.list()) {
			allocator.free(m);
		}
		allocator.free(this.mat);
	}

	pointerDy: number = -1;
	pointerDx: number = -1;

	defaultArrowPointPos(): Point {
		return new Point(this.left + GAP, (this.top + this.bottom) / 2);
	}

	moveTo(x: number, y: number) {
		this.setXY(x, y);
	}

	static addedWalls = new Set<string>();

	checkEvent(x: number, y: number, canvas: CanvasHandler) {
		const relMouseX = x - this.gridLeft - canvas.offset.x;
		const relMouseY = y - this.gridTop - canvas.offset.y;

		let gridX = Math.floor(relMouseX / CELL_SIZE);
		let gridY = Math.floor(relMouseY / CELL_SIZE);

		let tempX, tempY;

		switch(this.eventType) {
		case EventType.AddingWalls:
			if(gridX < 0 || gridX >= this.columns || gridY < 0 || gridY >= this.rows ||
				(gridX === this.src.x && gridY === this.src.y) ||
				(gridX === this.dest.x && gridY === this.dest.y)
			) {
				break;
			}

			const id = `${gridY}-${gridX}`;
			if(ElementAdjMatrix.addedWalls.has(id)) {
				break;
			}

			ElementAdjMatrix.addedWalls.add(id);

			this.setCell(gridY, gridX, (this.at(gridY, gridX) !== CellType.Cell) ? CellType.Cell : CellType.Wall);

			this.renderCell(canvas.ctx, gridX, gridY);
			break;
		case EventType.MovingSrc:
			if(gridX < 0) {
				gridX = 0;
			} else if(gridX >= this.columns) {
				gridX = this.columns - 1;
			}

			if(gridY < 0) {
				gridY = 0;
			} else if(gridY >= this.rows) {
				gridY = this.rows - 1;
			}

			if(
				(this.at(gridY, gridX) !== 0) ||
				(gridX === this.dest.x && gridY === this.dest.y)
			) {
				break;
			}

			tempX = this.src.x;
			tempY = this.src.y;

			this.setSrcXY(gridX, gridY);

			this.renderCell(canvas.ctx, tempX, tempY);
			this.renderSrcDest(canvas.ctx);
			break;
		case EventType.MovingDest:
			if(gridX < 0) {
				gridX = 0;
			} else if(gridX >= this.columns) {
				gridX = this.columns - 1;
			}

			if(gridY < 0) {
				gridY = 0;
			} else if(gridY >= this.rows) {
				gridY = this.rows - 1;
			}

			if(
				(this.at(gridY, gridX) !== 0) ||
				(gridX === this.src.x && gridY === this.src.y)
			) {
				break;
			}

			tempX = this.dest.x;
			tempY = this.dest.y;

			this.setDestXY(gridX, gridY);

			this.renderCell(canvas.ctx, tempX, tempY);
			this.renderSrcDest(canvas.ctx);
			break;
		}
	}

	pointerMove(state: EventState, canvas: CanvasHandler): void {
		if(state.pointerDown.x === -1) return;
		let { x, y } = state.pointerMove;

		if(this.eventType === EventType.Move) {
			x = Math.floor(x / GAP) * GAP - this.pointerDx;
			y = Math.floor(y / GAP) * GAP - this.pointerDy;

			this.setXY(x, y);
			canvas.redraw();
			return;
		}
		this.checkEvent(x, y, canvas);
	}

	remove(canvas: CanvasHandler) {
		allocator.free(this.ptr);
		canvas.removeElements(this);
	}

	async scrollTo(canvas: CanvasHandler) {
		const x = this.x + canvas.offset.x;
		const y = this.y + canvas.offset.y;
		if(!(x > 0 && x < canvas.width && y > 0 && y < canvas.height)) {
			await canvas.scrollTo(canvas.halfWidth - this.x, canvas.halfHeight - this.y, 30);
		}
	}

	pointerDown(state: EventState, canvas: CanvasHandler): void {
		let { x: elx, y: ely } = this;
		let { x: statex, y: statey } = state.pointerDown;
		this.pointerDx = Math.floor((statex - elx) / GAP) * GAP;
		this.pointerDy = Math.floor((statey - ely) / GAP) * GAP;

		this.checkEvent(statex, statey, canvas);
	}

	pointerUp(_state: EventState, _canvas: CanvasHandler): ElementHandler | null {
		ElementAdjMatrix.addedWalls.clear();
		this.eventType = EventType.None;
		return null;
	}

	isIntersect(x: number, y: number, _: Point, canvas: CanvasHandler): null | ElementHandler {
		if(this.intersects(x, y, canvas.offset)) return this;
		return null;
	}

	unfocus() {
		this.resetStyle();
	}

	focus() {
		this.borderColor = "#ffff00";
	}

	draw(ctx: CanvasRenderingContext2D) {
		this.paint(ctx);
	}
}

