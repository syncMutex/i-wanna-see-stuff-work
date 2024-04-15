import { GAP } from "../canvas";
import { ElementDEdge } from "../graph/el-d-edge";
import { ElementGNode } from "../graph/el-node";
import { ElementUEdge } from "../graph/el-u-edge";
import { CanvasHandler } from "../handler/canvas-handler";
import { ElementLLNode } from "../linked-list/el-node";
import { randInt } from "../utils";

export function sampleLinkedList(canvas: CanvasHandler, row: number, col: number) {
	let y = (canvas.transform.y * -1 / GAP) + (GAP);

	const nodes = [];

	for(let i = 0; i < row; i++) {
		let x = canvas.transform.x * -1 / GAP + GAP;
		for(let j = 0; j < col; j++) {
			const enode = new ElementLLNode(x * GAP, y * GAP, String(randInt(10, 500)));
			canvas.add(enode, enode.arrow);
			x += 12;
			nodes.push(enode);
		}
		y += 10;
	}

	for(let i = 0; i < nodes.length - 1; i++) {
		nodes[i].setNext(nodes[i + 1].ptr);
		nodes[i].updateArrowTail();
		nodes[i].updateArrowHead();
	}
	canvas.redraw();
}

export function sampleUGraph(canvas: CanvasHandler, row: number, col: number, isWeighted: boolean) {
	let y = (canvas.transform.y * -1 / GAP) + (GAP * 2);

	const nodes = [];

	for(let i = 0; i < row; i++) {
		let x = canvas.transform.x * -1 / GAP + (GAP * 2);
		for(let j = 0; j < col; j++) {
			const enode = new ElementGNode(x * GAP, y * GAP, String(randInt(1, 500)));
			canvas.add(enode);
			x += 10;
			nodes.push(enode);
		}
		y += 10;
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
			const edge = new ElementUEdge(a.ptr, b.ptr);

			edge.weight.value = isWeighted ? randInt(1, 50) : 0;
			edge.rectify();
			canvas.add(edge);
		}
	}

	canvas.redraw();
}

export function sampleDGraph(canvas: CanvasHandler, row: number, col: number, isWeighted: boolean) {
	let y = (canvas.transform.y * -1 / GAP) + (GAP * 2);

	const nodes = [];

	for(let i = 0; i < row; i++) {
		let x = canvas.transform.x * -1 / GAP + (GAP * 2);
		for(let j = 0; j < col; j++) {
			const enode = new ElementGNode(x * GAP, y * GAP, String(randInt(1, 500)));
			canvas.add(enode);
			x += 10;
			nodes.push(enode);
		}
		y += 10;
	}

	for(let i = 0; i < nodes.length - 1; i++) {
		const a = nodes[i];
		for(let j = 0; j < 1; j++) {
			let r = i;
			while(r === i) r = randInt(0, nodes.length);
			const b = nodes[r];
			if(ElementGNode.hasDEdge(a, b)) {
				continue;
			}
			const edge = new ElementDEdge(a, b.ptr);

			edge.weight.value = isWeighted ? randInt(1, 50) : 0;
			edge.rectify();
			canvas.add(edge);
		}
	}

	canvas.redraw();
}

export function sampleUEdgeMatrix(canvas: CanvasHandler, row: number, col: number, isWeighted: boolean) {
	let y = (canvas.transform.y * -1 / GAP) + (GAP);

	const nodes: Array<Array<ElementGNode>> = [[]];
	const d = isWeighted ? 9 : 7;

	for(let i = 0; i < row; i++) {
		let x = (canvas.transform.x * -1 / GAP) + (GAP);
		nodes.push([]);
		for(let j = 0; j < col; j++) {
			const enode = new ElementGNode(x * GAP, y * GAP, String(randInt(1, 500)));
			canvas.add(enode);
			x += d;
			nodes[i].push(enode);
		}
		y += d;
	}

	for(let i = 0; i < nodes.length; i++) {
		for(let j = 0; j < nodes[i].length; j++) {
			const adjacentNodes = [
				[j, i - 1],
				[j + 1, i],
				[j, i + 1],
				[j - 1, i],
			]; 
			const a = nodes[i][j];
			for(let [c, r] of adjacentNodes) {
				if((c < 0 || c >= col) || (r < 0 || r >= row)) {
					continue;
				}

				const b = nodes[r][c];
				if(ElementGNode.hasUEdge(a, b)) {
					continue;
				}

				const edge = new ElementUEdge(a.ptr, b.ptr);
				edge.weight.value = isWeighted ? randInt(1, 50) : 0;
				edge.rectify();
				canvas.add(edge);
			}
		}
	}

	canvas.redraw();
}

export function sampleDBTree(canvas: CanvasHandler, depth: number, isWeighted: boolean) {
	let y = (canvas.transform.y * -1 / GAP) + (GAP * 2);

	const nodes = [];

	let row = 5;
	let col = 5;

	for(let i = 0; i < row; i++) {
		let x = canvas.transform.x * -1 / GAP + (GAP * 2);
		for(let j = 0; j < col; j++) {
			const enode = new ElementGNode(x * GAP, y * GAP, String(randInt(1, 500)));
			canvas.add(enode);
			x += 10;
			nodes.push(enode);
		}
		y += 10;
	}

	for(let i = 0; i < nodes.length - 1; i++) {
		const a = nodes[i];
		for(let j = 0; j < 1; j++) {
			let r = i;
			while(r === i) r = randInt(0, nodes.length);
			const b = nodes[r];
			if(ElementGNode.hasDEdge(a, b)) {
				continue;
			}
			const edge = new ElementDEdge(a, b.ptr);

			edge.weight.value = randInt(1, 500);
			edge.rectify();
			canvas.add(edge);
		}
	}

	canvas.redraw();
}
