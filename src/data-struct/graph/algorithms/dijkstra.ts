import { ShallowRef, shallowRef } from "vue";
import { AlgorithmHandler } from "../../algorithm-handler";
import { CanvasHandler } from "../../handler/canvas-handler.ts";
import { ElementGNode } from "../el-node.ts";

// enum Color {
// 	visited = "#00ff00"
// };

class PriorityQueue {
	private qArr: Array<{dist: number, node: ElementGNode}> = [];

	private heapify(idx: number) {
		let heap = this.qArr;
		let smallestIdx = idx;
		const leftIdx = 2 * idx + 1;
		const rightIdx = 2 * idx + 2;

		if(leftIdx < heap.length && heap[leftIdx] < heap[smallestIdx]) {
			smallestIdx = leftIdx;
		}

		if(rightIdx < heap.length && heap[rightIdx] < heap[smallestIdx]) {
			smallestIdx = rightIdx;
		}

		if(smallestIdx !== idx) {
			[heap[smallestIdx], heap[idx]] = [heap[idx], heap[smallestIdx]];
			this.heapify(smallestIdx);
		}
	}

	insert(dist: number, node: ElementGNode): void {
		const qNode = { dist, node };
		this.qArr.push(qNode);
		let idx = this.qArr.length - 1;

		while(idx > 0 && this.qArr[(idx - 1) / 2].dist > this.qArr[idx].dist) {
			let pidx = (idx - 1) / 2;
			[this.qArr[idx], this.qArr[pidx]] = [this.qArr[pidx], this.qArr[idx]];

			idx = pidx;
		}
	}

	extractMin(): ElementGNode | undefined {
		[this.qArr[0], this.qArr[this.qArr.length - 1]] = [this.qArr[this.qArr.length - 1], this.qArr[0]];
		const min = this.qArr.pop()?.node;

		this.heapify(0);
		return min;
	}
}

class Dijkstra extends AlgorithmHandler {
	startNode: null | ElementGNode = null;
	endNode: null | ElementGNode = null;
	visited: ShallowRef<Set<ElementGNode>> = shallowRef(new Set<ElementGNode>());

	init(startNode: ElementGNode, endNode: ElementGNode) {
		this.startNode = startNode;
		this.endNode = endNode;
		this.visited.value = new Set<ElementGNode>();
	}

	uninit(canvas: CanvasHandler) {
		this.startNode = null;
		for(let n of this.visited.value) {
			n.edges.forEach((_, e) => e.bg = "#ffffff");
			n.resetStyle();
		}
		canvas.redraw();
	}

	*dijkstra(startNode: ElementGNode, endNode: ElementGNodem, canvas: CanvasHandler) {
		let minQueue = new PriorityQueue();
		let distanceTable: Map<ElementGNode, number> = new Map();
	}

	*generatorFn(canvas: CanvasHandler) {
		console.log(this.startNode?.value, this.endNode?.value);
		if(this.startNode && this.endNode) {
			let gen = this.dijkstra(this.startNode, this.endNode, canvas);
			while(!gen.next().done) {
				yield null;
			}
		}
	}
}

export default new Dijkstra();
