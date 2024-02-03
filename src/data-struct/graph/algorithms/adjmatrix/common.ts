import { Node } from "../../element-types/adjacency-matrix";

export class DistValue {
	prev: Node | null;
	dist: number;

	constructor(dist: number, prev: Node | null) {
		this.dist = dist;
		this.prev = prev;
	}
}

export class PriorityQueue<T> {
	private qArr: Array<{
		dist: number,
		node: T,
	}> = [];

	// private heapify(idx: number) {
	// 	let heap = this.qArr;
	// 	let smallestIdx = idx;
	// 	const leftIdx = 2 * idx + 1;
	// 	const rightIdx = 2 * idx + 2;

	// 	if(leftIdx < heap.length && heap[leftIdx] < heap[smallestIdx]) {
	// 		smallestIdx = leftIdx;
	// 	}

	// 	if(rightIdx < heap.length && heap[rightIdx] < heap[smallestIdx]) {
	// 		smallestIdx = rightIdx;
	// 	}

	// 	if(smallestIdx !== idx) {
	// 		[heap[smallestIdx], heap[idx]] = [heap[idx], heap[smallestIdx]];
	// 		this.heapify(smallestIdx);
	// 	}
	// }

	insert(dist: number, node: T): void {
		const qNode = { dist, node };
		this.qArr.push(qNode);
		let idx = this.qArr.length - 1;

		while(idx > 0 && this.qArr[Math.floor((idx - 1) / 2)].dist > this.qArr[idx].dist) {
			let pidx = Math.round((idx - 1) / 2);
			[this.qArr[idx], this.qArr[pidx]] = [this.qArr[pidx], this.qArr[idx]];

			idx = pidx;
		}
	}

	isEmpty() {
		return this.qArr.length === 0;
	}

	extractMin(): T | undefined {
		let min = 0;

		for(let i = 0; i < this.qArr.length; i++) {
			if(this.qArr[i].dist < this.qArr[min].dist) {
				min = i;
			}
		}

		return this.qArr.splice(min, 1)[0].node;
		// [this.qArr[0], this.qArr[this.qArr.length - 1]] = [this.qArr[this.qArr.length - 1], this.qArr[0]];
		// const min = this.qArr.pop()?.node;

		// this.heapify(0);
		// return min;
	}
}
