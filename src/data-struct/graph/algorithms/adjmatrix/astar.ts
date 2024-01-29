import { AlgorithmHandler } from "../../../algorithm-handler";
import { setErrorPopupText } from "../../../global";
import { CanvasHandler } from "../../../handler/canvas-handler";
import { AdjMatrix, CellType, Node } from "../../element-types/adjacency-matrix";
import { Heuristics, chebyshevDistance, euclidian, manhattan, octileDistance } from "../heuristics";

class PriorityQueue {
	private qArr: Array<{
		dist: number,
		node: Node,
	}> = [];

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

	insert(dist: number, node: Node): void {
		const qNode = { dist, node };
		this.qArr.push(qNode);
		let idx = this.qArr.length - 1;

		while(idx > 0 && this.qArr[Math.floor((idx - 1) / 2)].dist > this.qArr[idx].dist) {
			let pidx = Math.floor((idx - 1) / 2);
			[this.qArr[idx], this.qArr[pidx]] = [this.qArr[pidx], this.qArr[idx]];

			idx = pidx;
		}
	}

	isEmpty() {
		return this.qArr.length === 0;
	}

	extractMin(): Node | undefined {
		[this.qArr[0], this.qArr[this.qArr.length - 1]] = [this.qArr[this.qArr.length - 1], this.qArr[0]];
		const min = this.qArr.pop()?.node;

		this.heapify(0);
		return min;
	}
}

class DistValue { 
	g: number = Infinity;
	f: number = Infinity;
	prev: Node | null;

	constructor(prev: Node | null, f: number, g: number) {
		this.f = f;
		this.g = g;
		this.prev = prev;
	}
};

export default class AstarAdjMatrix extends AlgorithmHandler {
	adjMatrix: AdjMatrix | null = null;
	distanceTable: {[_:string]: DistValue} = {};
	curHeuristics: Heuristics = Heuristics.Manhattan;

	init(adjMatrix: AdjMatrix, heuristics: Heuristics, canvas: CanvasHandler) {
		this.adjMatrix = adjMatrix;
		this.distanceTable = {};
		this.cleanup(canvas);
		this.curHeuristics = heuristics;
	}

	cleanup(canvas: CanvasHandler) {
		if(this.adjMatrix) {
			this.adjMatrix.resetCells(canvas.ctx);
		}
	}

	forceStop(canvas: CanvasHandler): void {
		super.forceStop(canvas);
		this.cleanup(canvas);
	}

	*finalPath(adjMatrix: AdjMatrix, canvas: CanvasHandler) {
		const dest = adjMatrix.dest;
		const src = adjMatrix.src;

		let temp = this.distanceTable[dest.id];

		while(temp?.prev && temp.prev) {
			if(temp.prev.id !== src.id) {
				adjMatrix.mat[temp.prev.y][temp.prev.x] = CellType.Path;
				adjMatrix.renderCell(canvas.ctx, temp.prev.x, temp.prev.y);
				yield null;
			}
			temp = this.distanceTable[temp.prev.id];
		}
	}

	heuristics(node: Node, dest: Node) {
		switch(this.curHeuristics) {
			case Heuristics.Manhattan:
				return manhattan(node, dest);
			case Heuristics.Euclidian:
				return euclidian(node, dest);
			case Heuristics.OctileDistance:
				return octileDistance(node, dest);
			case Heuristics.ChebyshevDistance:
				return chebyshevDistance(node, dest);
		}
	}

	*astar(adjMatrix: AdjMatrix, canvas: CanvasHandler) {
		const src = adjMatrix.src;
		const dest = adjMatrix.dest;
		let minQueue = new PriorityQueue();
		let distanceTable = this.distanceTable;
		let visited = new Set<string>();

		distanceTable[src.id] = new DistValue(null, 0, this.heuristics(src, dest));
		minQueue.insert(0, src);

		while(!minQueue.isEmpty()) {
			const cur = minQueue.extractMin();

			if(!cur) throw new Error("priority queue is empty.");

			if(cur.id === dest.id) {
				let gen = this.finalPath(adjMatrix, canvas);
				while(!gen.next().done) yield null;
				return;
			}

			const curDistVal = distanceTable[cur.id] as DistValue;

			const adjacentNodes = [
				// top
				new Node(cur.x, cur.y - 1),
				// right
				new Node(cur.x + 1, cur.y),
				// bottom
				new Node(cur.x, cur.y + 1),
				// left
				new Node(cur.x - 1, cur.y),
			]; 

			for(const adjNode of adjacentNodes) {
				if(
					(adjNode.x < 0 || adjNode.x >= adjMatrix.columns) ||
					(adjNode.y < 0 || adjNode.y >= adjMatrix.rows) ||
					(adjMatrix.mat[adjNode.y][adjNode.x] === CellType.Wall)
				) {
					continue;
				}

				if(!(adjNode.id in distanceTable)) {
					distanceTable[adjNode.id] = new DistValue(null, Infinity, Infinity);
				}
				const adjDistVal = distanceTable[adjNode.id] as DistValue;

				const gNew = curDistVal.g + 1;
				const hNew = this.heuristics(adjNode, dest);
				const fNew = gNew + hNew;

				if(adjDistVal.f > fNew) {
					distanceTable[adjNode.id] = new DistValue(cur, fNew, gNew);
					
					if(adjNode.id === dest.id) {
						let gen = this.finalPath(adjMatrix, canvas);
						while(!gen.next().done) yield null;
						return;
					}

					if(!visited.has(adjNode.id)) {
						if(adjNode.id !== src.id && adjNode.id !== dest.id) {
							adjMatrix.mat[adjNode.y][adjNode.x] = CellType.AdjNode;
							adjMatrix.renderCell(canvas.ctx, adjNode.x, adjNode.y);
							yield null;
						}
						visited.add(adjNode.id);
						minQueue.insert(fNew, adjNode);
					}
				}
			}

			visited.add(cur.id);
			if(cur.id !== src.id && cur.id !== dest.id) {
				adjMatrix.mat[cur.y][cur.x] = CellType.Visited;
				adjMatrix.renderCell(canvas.ctx, cur.x, cur.y);
				yield null;
			}
		}

		setErrorPopupText("The node is unreachable.");
	}

	*generatorFn(canvas: CanvasHandler) {
		if(this.adjMatrix) {
			let gen = this.astar(this.adjMatrix, canvas);
			while(!gen.next().done) {
				yield null;
			}
		}
	}
}

