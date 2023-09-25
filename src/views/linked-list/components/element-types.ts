import { GAP } from "./canvas";
import { Line } from "./geometry";

interface Intersect {
	isIntersect: (x: number, y: number) => boolean;
}

export class Node implements Intersect {
	static width = GAP * 9;
	static height = GAP * 3;

	static dividerColor = "#47008a";
	static bg = "#8400ff";

	static halfWidth = (Math.floor((Node.width / GAP) / 2) * GAP);
	static halfHeight = (Math.floor((Node.height / GAP) / 2) * GAP);

	x = -1;
	y = -1;
	value: string = "";

	constructor(value: string) {
		this.value = value;
	}
	
	setXY(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	dividerX() {
		return this.right - GAP * 3;
	}
	
	get top() {
		return this.y;
	}

	get bottom() {
		return this.y + Node.height;
	}

	get left() {
		return this.x;
	}

	get right() {
		return this.x + Node.width;
	}

	isIntersect(x: number, y: number): boolean {
		const lowx = this.x;
		const lowy = this.y;
		const highx = this.x + Node.width;
		const highy = this.y + Node.height;
		return x >= lowx && x <= highx && y >= lowy && y <= highy;
	}
}

export class Arrow implements Intersect {
	head = { x: -1, y: -1 };
	tail = { x: -1, y: -1 };

	static notPointingColor = "#AAAAAA";
	static pointingColor = "#FFFFFF";
	static insertColor = "#FFFF00"
	static invalidInsert = "#FF0000";

	bg: string = Arrow.notPointingColor;

	isIntersect(x: number, y: number): boolean {
		const p = new Line(this.tail, this.head).getPositionAlongTheLine(0.98);
		const mag = 10;
		const lowx = p.x - mag;
		const lowy = p.y - mag;
		const highx = p.x + mag;
		const highy = p.y + mag;
		return x >= lowx && x <= highx && y >= lowy && y <= highy;
	}
}

export class Empty {}

export type ELEMENT = Node | Empty;
