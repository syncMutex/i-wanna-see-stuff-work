import { Point } from "../../geometry";

export const CELL_SIZE: number = 16;

export enum EventType {
	None,
	Move,
	AddingWalls,
	MovingSrc,
	MovingDest,
}

export class AdjMatrix {
	static bg: string = "#ff00ff";
	static cellColor: string = "#ffffff";
	static wallColor: string = "#787878";
	static srcColor: string = "#ffff00";
	static destColor: string = "#0000ff";

	rows: number;
	columns: number;

	x: number;
	y: number;

	mat: Array<Array<number>>;

	borderColor = "#ffffff";

	src: Point = { x: 0, y: 0 };
	dest: Point = { x: 1, y: 1 };

	eventType: EventType = EventType.None;

	constructor(x: number, y: number, mat: Array<Array<number>>) {
		this.mat = mat;
		this.rows = mat.length;
		this.columns = mat[0]?.length || 0;
		this.x = x;
		this.y = y;
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
				if(this.mat[i][j] !== 0) {
					ctx.fillStyle = AdjMatrix.wallColor;
				} else {
					ctx.fillStyle = AdjMatrix.cellColor;
				}
				ctx.fillRect(x, y, CELL_SIZE - 2, CELL_SIZE - 2);
			}
		}

		ctx.fillStyle = AdjMatrix.srcColor;
		ctx.fillRect(
			this.gridLeft + this.src.x * CELL_SIZE,
			this.gridTop + this.src.y * CELL_SIZE,
			CELL_SIZE - 2,
			CELL_SIZE - 2
		);

		ctx.fillStyle = AdjMatrix.destColor;
		ctx.fillRect(
			this.gridLeft + this.dest.x * CELL_SIZE,
			this.gridTop + this.dest.y * CELL_SIZE,
			CELL_SIZE - 2,
			CELL_SIZE - 2
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
			const sTop = this.src.x * CELL_SIZE;
			const sLeft = this.src.y * CELL_SIZE;
			const dTop = this.dest.x * CELL_SIZE;
			const dLeft = this.dest.y * CELL_SIZE;

			console.log(dTop, dLeft, relMouseX, relMouseY);

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
