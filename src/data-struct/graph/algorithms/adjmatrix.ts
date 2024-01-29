import { AlgorithmHandler } from "../../algorithm-handler";
import { setErrorPopupText } from "../../global";
import { CanvasHandler } from "../../handler/canvas-handler";
import { AdjMatrix, CellType, Node } from "../element-types/adjacency-matrix";

class DistValue {
	prev: Node | null;
	dist: number;

	constructor(dist: number, prev: Node | null) {
		this.dist = dist;
		this.prev = prev;
	}
}

class PriorityQueue {
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

class DijkstraAdjMatrixClass extends AlgorithmHandler {
	adjMatrix: AdjMatrix | null = null;
	distanceTable: {[_:string]: DistValue} = {};

	init(adjMatrix: AdjMatrix, canvas: CanvasHandler) {
		this.adjMatrix = adjMatrix;
		this.distanceTable = {};
		this.cleanup(canvas);
	}

	uninit(_canvas: CanvasHandler) {
	}

	cleanup(canvas: CanvasHandler) {
		if(!this.adjMatrix) {
			return;
		}

		this.adjMatrix.resetCells(canvas.ctx);
	}

	forceStop(canvas: CanvasHandler): void {
		super.forceStop(canvas);
		this.cleanup(canvas);
	}

	*finalPath(adjMatrix: AdjMatrix, canvas: CanvasHandler) {
		const dest = adjMatrix.dest;
		const src = adjMatrix.src;

		let temp = this.distanceTable[dest.id];
		if(!temp?.prev) {
			setErrorPopupText("The node is not reachable from the source node.");
			return;
		}

		while(temp?.prev && temp.prev) {
			if(temp.prev.id !== src.id) {
				adjMatrix.mat[temp.prev.y][temp.prev.x] = CellType.Path;
				adjMatrix.renderCell(canvas.ctx, temp.prev.x, temp.prev.y);
				yield null;
			}
			temp = this.distanceTable[temp.prev.id];
		}
	}


	*dijkstra(adjMatrix: AdjMatrix, canvas: CanvasHandler) {
		const src = adjMatrix.src;
		const dest = adjMatrix.dest;

		let minQueue = new PriorityQueue();
		let distanceTable = this.distanceTable;

		let visited = new Set<string>();

		distanceTable[src.id] = new DistValue(0, null);
		minQueue.insert(0, src);

		while(!minQueue.isEmpty()) {
			const cur = minQueue.extractMin();

			if(!cur) throw new Error("priority queue is empty.");

			if(cur.id === dest.id) {
				break;
			}

			if(visited.has(cur.id)) {
				return;
			}

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

			for(let adjNode of adjacentNodes) {
				if(
					(adjNode.x < 0 || adjNode.x >= adjMatrix.columns) ||
					(adjNode.y < 0 || adjNode.y >= adjMatrix.rows) ||
					(adjMatrix.mat[adjNode.y][adjNode.x] === CellType.Wall)
				) {
					continue;
				}

				const adjNodeId = adjNode.id;
				if(!(adjNodeId in distanceTable)) {
					distanceTable[adjNodeId] = new DistValue(Infinity, null);

					if(adjNode.id !== src.id && adjNode.id !== dest.id) {
						adjMatrix.mat[adjNode.y][adjNode.x] = CellType.AdjNode;
						adjMatrix.renderCell(canvas.ctx, adjNode.x, adjNode.y);
						yield null;
					}
				}

				const newDist = (distanceTable[cur.id]?.dist as number) + 1;

				if((distanceTable[adjNode.id]?.dist as number) > newDist) {
					distanceTable[adjNode.id] = new DistValue(newDist, cur);
					minQueue.insert(newDist, adjNode);
				}
			}

			visited.add(cur.id);
			if(cur.id !== src.id && cur.id !== dest.id) {
				adjMatrix.mat[cur.y][cur.x] = CellType.Visited;
				adjMatrix.renderCell(canvas.ctx, cur.x, cur.y);
				yield null;
			}
		}

		let gen = this.finalPath(adjMatrix, canvas);
		while(!gen.next().done) yield null;
	}

	*generatorFn(canvas: CanvasHandler) {
		if(this.adjMatrix) {
			let gen = this.dijkstra(this.adjMatrix, canvas);
			while(!gen.next().done) {
				yield null;
			}
		}
	}
}

export const DijkstraAdjMatrix = new DijkstraAdjMatrixClass;

// export function Astar(adjMatrix: ElementAdjMatrix) {
// }
// 
// export function Bfs(adjMatrix: ElementAdjMatrix) {
// }
// 
// export function Dfs(adjMatrix: ElementAdjMatrix) {
// }

