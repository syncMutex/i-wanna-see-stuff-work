import { circleFill } from "../../canvas";
import { Point } from "../../geometry";

export const CELL_SIZE: number = 20;

export enum EventType {
	None,
	Move,
	AddingWalls,
	MovingSrc,
	MovingDest,
}

export enum CellType {
	Cell,
	Wall,
	Src,
	Dest,
	Path,
	Visited,
	AdjNode
}

export const CellColor = {
	[CellType.Cell]: "#ffffff",
	[CellType.Wall]: "#444444",
	[CellType.Src]: "#ff0000",
	[CellType.Dest]: "#0000ff",
	[CellType.Path]: "#00ff00",
	[CellType.Visited]: "#8d58c7",
	[CellType.AdjNode]: "#6f13d1",
}

export class Node {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	get id() {
		return `${this.y}|${this.x}`;
	}
}

export class AdjMatrix {
	rows: number;
	columns: number;

	x: number;
	y: number;

	mat: Array<Array<CellType>>;

	borderColor = "#ffffff";

	src: Node = new Node(0, 0);
	dest: Node = new Node(0, 0);

	eventType: EventType = EventType.None;

	constructor(x: number, y: number, mat: Array<Array<number>>) {
		this.mat = mat;
		this.rows = mat.length;
		this.columns = mat[0]?.length || 0;

		this.x = x;
		this.y = y;

		this.setDestXY(1, 1);
		this.setSrcXY(0, 0);
	}

	setDestXY(x: number, y: number) {
		this.mat[this.dest.y][this.dest.x] = CellType.Cell;
		this.dest.x = x;
		this.dest.y = y;
		this.mat[y][x] = CellType.Dest;
	}

	setSrcXY(x: number, y: number) {
		this.mat[this.src.y][this.src.x] = CellType.Cell;
		this.src.x = x;
		this.src.y = y;
		this.mat[y][x] = CellType.Src;
	}

	renderCell(ctx: CanvasRenderingContext2D, x: number, y: number) {
		ctx.fillStyle = CellColor[this.mat[y][x]];
		ctx.fillRect(
			this.gridLeft + x * CELL_SIZE,
			this.gridTop + y * CELL_SIZE,
			CELL_SIZE - 2,
			CELL_SIZE - 2
		);
	}

	resetCells(ctx: CanvasRenderingContext2D) {
		let x;
		let y = this.y + 1 + CELL_SIZE;

		for(let i = 0; i < this.rows; i++, y += CELL_SIZE) {
			x = this.x + 1 + CELL_SIZE;
			for(let j = 0; j < this.columns; j++, x += CELL_SIZE) {
				const cell = this.mat[i][j];
				if(cell === CellType.Visited || cell === CellType.Path || cell === CellType.AdjNode) {
					this.mat[i][j] = CellType.Cell;
				}
				ctx.fillStyle = CellColor[this.mat[i][j]];
				ctx.fillRect(x, y, CELL_SIZE - 2, CELL_SIZE - 2);
			}
		}

		this.renderSrcDest(ctx);
	}

	clearCells(ctx: CanvasRenderingContext2D) {
		let x;
		let y = this.y + 1 + CELL_SIZE;

		for(let i = 0; i < this.rows; i++, y += CELL_SIZE) {
			x = this.x + 1 + CELL_SIZE;
			for(let j = 0; j < this.columns; j++, x += CELL_SIZE) {
				const cell = this.mat[i][j];

				if(cell !== CellType.Src && cell !== CellType.Dest) {
					this.mat[i][j] = CellType.Cell;
				}

				ctx.fillStyle = CellColor[this.mat[i][j]];
				ctx.fillRect(x, y, CELL_SIZE - 2, CELL_SIZE - 2);
			}
		}

		this.renderSrcDest(ctx);
	}

	setRows(rows: number) {
		const prev = this.rows;

		if(rows > prev) {
			this.rows = rows;

			for(let i = this.mat.length; i < rows; ++i) {
				this.mat[i] = new Array(this.columns).fill(0);
			}
		} else {
			if(this.mat.length < 3) {
				this.mat = this.mat.slice(0, 2);
			} else {
				this.mat = this.mat.slice(0, rows);
				this.rows = rows;
			}

			const lastIdx = rows - 1;

			if(this.src.y >= rows) {
				this.src.y = lastIdx;
				this.mat[lastIdx][this.src.x] = CellType.Src;
			}
			if(this.dest.y >= rows) {
				this.dest.y = lastIdx;
				this.mat[lastIdx][this.dest.x] = CellType.Dest;
			}
		}
	}

	setColumns(columns: number) {
		const prev = this.columns;

		if(columns > prev) {
			this.columns = columns;
			this.mat = this.mat.map(row => [...row, ...new Array(this.columns).fill(0)]);
		} else {
			if((this.mat[0]?.length || 0) < 3) {
				this.mat = this.mat.map(row => row.slice(0, 2));
			} else {
				this.mat = this.mat.map(row => row.slice(0, columns));
				this.columns = columns;
			}

			const lastIdx = columns - 1;

			if(this.src.x >= columns) {
				this.src.x = lastIdx;
				this.mat[this.src.y][lastIdx] = CellType.Src;
			}
			if(this.dest.x >= columns) {
				this.dest.x = lastIdx;
				this.mat[this.dest.y][lastIdx] = CellType.Dest;
			}
		}
	}

	paint(ctx: CanvasRenderingContext2D) {
		const left = this.left;
		const top = this.top;
		// border
		ctx.strokeStyle = this.borderColor;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.roundRect(left, top, this.width, this.height, 5);
		ctx.stroke();

		// display dimensions
		const dimStr = `${this.rows}x${this.columns}`;
		const strH = 12;
		const strW = dimStr.length * strH;

		ctx.beginPath();
		ctx.fillStyle = "#7703fc";
		ctx.roundRect(left - strW / 2, top - strH / 2 - 4, strW, 18, 4);
		ctx.fill();

		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		ctx.font = `${strH}px monospace`;
		ctx.fillStyle = "#ffffff";
		ctx.fillText(dimStr, this.x, this.y);

		// draw cells
		let x;
		let y = this.y + 1 + CELL_SIZE;

		for(let i = 0; i < this.rows; i++, y += CELL_SIZE) {
			x = this.x + 1 + CELL_SIZE;
			for(let j = 0; j < this.columns; j++, x += CELL_SIZE) {
				ctx.fillStyle = CellColor[this.mat[i][j]];
				ctx.fillRect(x, y, CELL_SIZE - 2, CELL_SIZE - 2);
			}
		}

		// this.debugInfo(ctx);

		this.renderSrcDest(ctx);
	}

	debugInfo(ctx: CanvasRenderingContext2D) {
		let y = this.y + CELL_SIZE;
		let x = this.x;

		ctx.fillStyle = "#ffffff";

		for(let i = 0; i < this.rows; i++, y += CELL_SIZE) {
			ctx.textBaseline = "middle";
			ctx.textAlign = "center";
			ctx.font = `14px monospace`;
			ctx.fillText(String(i), x + CELL_SIZE / 2, y + CELL_SIZE / 2);
		}

		y = this.y;
		x = this.x + CELL_SIZE;

		for(let i = 0; i < this.columns; i++, x += CELL_SIZE) {
			ctx.textBaseline = "middle";
			ctx.textAlign = "center";
			ctx.font = `14px monospace`;
			ctx.fillText(String(i), x + CELL_SIZE / 2, y + CELL_SIZE / 2);
		}
	}

	renderSrcDest(ctx: CanvasRenderingContext2D) {
		const HCELL_SIZE = (CELL_SIZE - 2) / 2;

		// src
		this.mat[this.src.y][this.src.x] = CellType.Cell;
		this.renderCell(ctx, this.src.x, this.src.y);

		this.mat[this.src.y][this.src.x] = CellType.Src;
		ctx.fillStyle = CellColor[this.mat[this.src.y][this.src.x]];

		let sx = this.gridLeft + (this.src.x * CELL_SIZE);
		let sy = this.gridTop + (this.src.y * CELL_SIZE);

		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.moveTo(sx + 2, sy + 2);
		ctx.lineTo(sx + 2, sy + CELL_SIZE - 4);
		ctx.lineTo(sx + CELL_SIZE - 2, sy + HCELL_SIZE);
		ctx.closePath();
		ctx.fill();

		// dest

		this.mat[this.dest.y][this.dest.x] = CellType.Cell;
		this.renderCell(ctx, this.dest.x, this.dest.y);

		this.mat[this.dest.y][this.dest.x] = CellType.Dest;
		ctx.fillStyle = CellColor[this.mat[this.dest.y][this.dest.x]];
		circleFill(
			ctx,
			this.gridLeft + this.dest.x * CELL_SIZE + HCELL_SIZE,
			this.gridTop + this.dest.y * CELL_SIZE + HCELL_SIZE,
			HCELL_SIZE - 1,
		);
	}

	resetStyle() {
		this.borderColor = "#ffffff";
	}

	setXY(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	get width() { return this.columns * CELL_SIZE + CELL_SIZE * 2; }

	get height() { return this.rows * CELL_SIZE + CELL_SIZE * 2; }
	
	get top() { return this.y; }

	get bottom() { return this.y + this.height + CELL_SIZE * 2; }

	get left() { return this.x; }

	get right() { return this.x + this.width + CELL_SIZE * 2; }

	get gridTop() { return this.y + CELL_SIZE + 1; }

	get gridBottom() { return this.y + CELL_SIZE + 1 + this.rows * CELL_SIZE; }

	get gridLeft() { return this.x + CELL_SIZE + 1; }

	get gridRight() { return this.x + CELL_SIZE + 1 + this.columns * CELL_SIZE; }

	intersects(x: number, y: number, offset: Point): boolean {
		const left = this.x + offset.x;
		const top = this.y + offset.y;
		const right = left + this.width;
		const bottom = top + this.height;

		const isIntersect = x >= left && x <= right && y >= top && y <= bottom; 

		if(!isIntersect) {
			return false;
		}

		const relMouseX = x - this.gridLeft - offset.x;
		const relMouseY = y - this.gridTop - offset.y;

		const isIntersectGrid = (
			(relMouseX >= 0 && relMouseX <= this.columns * (CELL_SIZE)) &&
			(relMouseY >= 0 && relMouseY <= this.rows * (CELL_SIZE))
		);

		if(isIntersectGrid) {
			const sTop = this.src.y * CELL_SIZE;
			const sLeft = this.src.x * CELL_SIZE;
			const dTop = this.dest.y * CELL_SIZE;
			const dLeft = this.dest.x * CELL_SIZE;

			if(
				(relMouseX >= sLeft && relMouseX <= sLeft + CELL_SIZE) &&
				(relMouseY >= sTop && relMouseY <= sTop + CELL_SIZE)
			) {
				this.eventType = EventType.MovingSrc;
			} else if(
				(relMouseX >= dLeft && relMouseX <= dLeft + CELL_SIZE) &&
				(relMouseY >= dTop && relMouseY <= dTop + CELL_SIZE)
			) {
				this.eventType = EventType.MovingDest;
			} else {
				this.eventType = EventType.AddingWalls;
			}
		} else {
			this.eventType = EventType.Move;
		}

		return true;
	}
}