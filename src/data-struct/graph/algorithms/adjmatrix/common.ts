import { Node } from "../../element-types/adjacency-matrix";

export class DistValue {
	prev: Node | null;
	dist: number;

	constructor(dist: number, prev: Node | null) {
		this.dist = dist;
		this.prev = prev;
	}
}

export class PriorityQueue {
	private qArr: Array<{
		dist: number,
		node: Node,
	}> = [];

	insert(dist: number, node: Node): void {
		this.qArr.push({dist, node});
	}

	isEmpty() {
		return this.qArr.length === 0;
	}

	extractMin(): Node | undefined {
		const min = this.qArr.shift()?.node;
		return min;
	}
}
