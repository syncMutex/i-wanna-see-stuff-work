import { GAP } from "./canvas";

export class Node {
	static width = GAP * 9;
	static height = GAP * 3;

	static halfWidth = (Math.floor((Node.width / GAP) / 2) * GAP);
	static halfHeight = (Math.floor((Node.height / GAP) / 2) * GAP);

	x = -1;
	y = -1;

	value: null | string = null;

	setXY(x: number, y: number) {
		this.x = x;
		this.y = y;
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
}

export class Arrow {
	head = { x: -1, y: -1 };
	tail = { x: -1, y: -1 };
}

export class Empty {
}

export type ELEMENT = Node | Empty;
