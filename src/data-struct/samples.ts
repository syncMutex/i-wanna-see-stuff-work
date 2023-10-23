import { GAP } from "./canvas";
import { ElementGNode } from "./graph/el-node";
import { ElementUEdge } from "./graph/el-u-edge";
import { CanvasHandler } from "./handler/canvas-handler";
import { ElementLLNode } from "./linked-list/el-node";
import { randInt } from "./utils";
// import { randInt } from "./utils";

export function createSampleLinkedList(canvas: CanvasHandler) {
	let y = 0;

	const nodes = [];

	let row = 5;
	let col = 5;

	for(let i = 0; i < row; i++) {
		let x = 0;
		for(let j = 0; j < col; j++) {
			const enode = new ElementLLNode(x * GAP, y * GAP, String(String(i) + j));
			canvas.add(enode, enode.arrow);
			x += 12;
			nodes.push(enode);
		}
		y += 10;
	}

	for(let i = 0; i < nodes.length - 1; i++) {
		nodes[i].setNext(nodes[i + 1]);
		// nodes[i].moveTo(randInt(-400, 400), randInt(-400, 400));
		nodes[i].updateArrowTail();
		nodes[i].updateArrowHead();
	}
	canvas.redraw();

}

export function createSampleGraph(canvas: CanvasHandler) {
	let y = 10;

	const nodes = [];

	let row = 5;
	let col = 5;

	for(let i = 0; i < row; i++) {
		let x = 10;
		for(let j = 0; j < col; j++) {
			const enode = new ElementGNode(x * GAP, y * GAP, String(String(i) + j));
			canvas.add(enode);
			x += 15;
			nodes.push(enode);
		}
		y += 15;
	}

	for(let i = 0; i < nodes.length; i++) {
		const a = nodes[i];
		for(let j = 0; j < 1; j++) {
			let r = i;
			while(r === i) r = randInt(0, nodes.length);
			const b = nodes[r];
			const edge = new ElementUEdge(a, b);
			if(a.hasUEdge(edge)) continue;

			edge.init();
			edge.weight = i + j;
			edge.rectify();
			canvas.add(edge);
		}
	}

	canvas.redraw();
}
