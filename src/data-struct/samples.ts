import { GAP } from "./canvas";
import { ElementDEdge } from "./graph/el-d-edge";
import { ElementGNode } from "./graph/el-node";
import { ElementUEdge } from "./graph/el-u-edge";
import { CanvasHandler } from "./handler/canvas-handler";
import { ElementLLNode } from "./linked-list/el-node";
import { randInt } from "./utils";
// import { randInt } from "./utils";

export function createSampleLinkedList(canvas: CanvasHandler) {
	let y = 30;

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

export function createSampleUGraph(canvas: CanvasHandler) {
	// const n1 = new ElementGNode(40 * GAP, 20 * GAP, "n1");
	// canvas.add(n1);

	// const n2 = new ElementGNode(80 * GAP, 20 * GAP, "n2");
	// canvas.add(n2);


	// const edge = new ElementUEdge(n1, n2);

	// edge.weight = randInt(0, 500);
	// edge.rectify();
	// canvas.add(edge);

	// return;
	let y = 10;

	const nodes = [];

	let row = 4;
	let col = 4;

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
			if(ElementGNode.hasUEdge(a, b)) {
				continue;
			}
			const edge = new ElementUEdge(a, b);

			edge.weight = randInt(0, 500);
			edge.rectify();
			canvas.add(edge);
		}
	}

	canvas.redraw();
}

export function createSampleDGraph(canvas: CanvasHandler) {
	let y = 5;

	const nodes = [];

	let row = 2;
	let col = 2;

	for(let i = 0; i < row; i++) {
		let x = 5;
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
			if(ElementGNode.hasDEdge(a, b)) {
				continue;
			}
			const edge = new ElementDEdge(a, b);

			edge.weight = randInt(0, 500);
			edge.rectify();
			canvas.add(edge);
		}
	}

	canvas.redraw();
}

export function createSampleDfs(canvas: CanvasHandler) {
	let y = 10;

	const nodes = [];

	let row = 3;
	let col = 3;

	for(let i = 0; i < row; i++) {
		let x = 40;
		for(let j = 0; j < col; j++) {
			const enode = new ElementGNode(x * GAP, y * GAP, String(String(i) + j));
			canvas.add(enode);
			x += 15;
			nodes.push(enode);
		}
		y += 15;
	}

	const addEdge = (a: ElementGNode, b: ElementGNode) => {
		if(ElementGNode.hasDEdge(a, b)) {
			return;
		}
		const edge = new ElementUEdge(a, b);

		edge.weight = randInt(0, 500);
		edge.rectify();
		canvas.add(edge);
	}

	addEdge(nodes[0], nodes[1]);
	addEdge(nodes[0], nodes[3]);
	addEdge(nodes[3], nodes[4]);
	addEdge(nodes[1], nodes[3]);
	addEdge(nodes[1], nodes[4]);
	addEdge(nodes[2], nodes[4]);
	addEdge(nodes[2], nodes[1]);
	addEdge(nodes[6], nodes[3]);
	addEdge(nodes[6], nodes[4]);
	addEdge(nodes[6], nodes[5]);
	addEdge(nodes[5], nodes[1]);

	canvas.redraw();
}

export function createSampleBfs(canvas: CanvasHandler) {
	let y = 10;

	const nodes = [];

	let row = 3;
	let col = 3;

	for(let i = 0; i < row; i++) {
		let x = 40;
		for(let j = 0; j < col; j++) {
			const enode = new ElementGNode(x * GAP, y * GAP, String(String(i) + j));
			canvas.add(enode);
			x += 15;
			nodes.push(enode);
		}
		y += 15;
	}

	const addEdge = (a: ElementGNode, b: ElementGNode) => {
		if(ElementGNode.hasDEdge(a, b)) {
			return;
		}
		const edge = new ElementUEdge(a, b);

		edge.weight = randInt(0, 500);
		edge.rectify();
		canvas.add(edge);
	}

	addEdge(nodes[0], nodes[1]);
	addEdge(nodes[0], nodes[3]);
	addEdge(nodes[1], nodes[4]);
	addEdge(nodes[2], nodes[4]);
	addEdge(nodes[1], nodes[2]);
	addEdge(nodes[3], nodes[4]);

	canvas.redraw();
}
