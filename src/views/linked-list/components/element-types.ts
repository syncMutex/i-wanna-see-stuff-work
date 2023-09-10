import { GAP } from "./canvas";

export class Node {
	static width = GAP * 10;
	static height = GAP * 5;

	static halfWidth = (Math.floor((Node.width / GAP) / 2) * GAP);
	static halfHeight = (Math.floor((Node.height / GAP) / 2) * GAP);

	x: number = -1;
	y: number = -1;

	setXY(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}

export type ELEMENT = Node;
