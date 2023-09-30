import { GAP } from "./canvas";
import { ElementNode } from "./linked-list/el-node";
import { ToolNode } from "./linked-list/tool-node";
import { CanvasHandler } from "./playground-handler";

export interface ToolType {
	name: string,
	toolClass: any
}

export const ToolList: ToolType[] = [
	{ name: "Node", toolClass: ToolNode },
]

export function randInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min) + min);
}

export function createSampleLinkedList(canvas: CanvasHandler) {
	let y = 0;

	const nodes = [];

	let row = 5;
	let col = 5;

	for(let i = 0; i < row; i++) {
		let x = 0;
		for(let j = 0; j < col; j++) {
			const enode = new ElementNode(x * GAP, y * GAP, String(String(i) + j));
			canvas.add(enode, enode.arrow);
			x += 12;
			nodes.push(enode);
		}
		y += 10;
	}

	for(let i = 0; i < nodes.length - 1; i++) {
		nodes[i].setNext(nodes[i + 1]);
		nodes[i].updateArrowHead();
	}
	canvas.redraw();
}

