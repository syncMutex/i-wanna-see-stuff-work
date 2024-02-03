import { Ref, ref } from "vue";
import { AlgorithmHandler } from "../../algorithm-handler";
import { CanvasHandler } from "../../handler/canvas-handler.ts";
import { ElementGNode } from "../el-node.ts";
import { ElementUEdge } from "../el-u-edge.ts";
import { setErrorPopupText } from "../../global.ts";
import { ElementDEdge } from "../el-d-edge.ts";
import { PriorityQueue } from "./adjmatrix/common.ts";

enum Color {
	shortPath = "#00ff00",
	curNode = "#0000ff",
	visited = "#c7fccc",
	compare = "#ffff00"
};

class DistValue { 
	dist: number;
	prev: ElementGNode | null;
	prevEdge: ElementUEdge | ElementDEdge | null;

	constructor(dist: number, prev: ElementGNode | null, prevEdge: ElementDEdge | ElementUEdge | null) {
		this.dist = dist;
		this.prev = prev;
		this.prevEdge = prevEdge;
	}
};

class Dijkstra extends AlgorithmHandler {
	startNode: null | ElementGNode = null;
	endNode: null | ElementGNode = null;
	distanceTable: Ref<Map<ElementGNode, DistValue>> = ref(new Map());

	init(startNode: ElementGNode, endNode: ElementGNode) {
		this.startNode = startNode;
		this.endNode = endNode;
		this.distanceTable.value = new Map<ElementGNode, DistValue>();
	}

	uninit(_canvas: CanvasHandler) {
	}

	cleanup(canvas: CanvasHandler) {
		for(let [node] of this.distanceTable.value) {
			node.resetStyle();
			node.draw(canvas.ctx);
			node.edges.forEach((_, e) => {
				if(e.bg !== "#ffffff") {
					e.bg = "#ffffff";
					e.draw(canvas.ctx);
				}
			});
		}
	}

	forceStop(canvas: CanvasHandler): void {
		super.forceStop(canvas);
		this.cleanup(canvas);
	}

	*finalPath(canvas: CanvasHandler, endNode: ElementGNode) {
		let distanceTable = this.distanceTable;

		let temp = distanceTable.value.get(endNode);
		if(!temp?.prev) {
			setErrorPopupText("The node is not reachable from the source node.");
			return;
		}

		endNode.setStyle(Color.shortPath, "#000000").draw(canvas.ctx);

		while(temp?.prev && temp.prevEdge) {
			temp.prev.bg = Color.shortPath;
			temp.prevEdge.bg = Color.shortPath;

			temp.prevEdge.draw(canvas.ctx);
			yield null;
			temp.prev.draw(canvas.ctx);
			yield null;

			temp = distanceTable.value.get(temp.prev);
		}
	}

	*dijkstra(startNode: ElementGNode, endNode: ElementGNode, canvas: CanvasHandler) {
		let minQueue = new PriorityQueue<ElementGNode>();
		let distanceTable = this.distanceTable;

		let visited = new Set<ElementGNode>();

		distanceTable.value.set(startNode, new DistValue(0, null, null));
		minQueue.insert(0, startNode);

		while(!minQueue.isEmpty()) {
			const cur = minQueue.extractMin();

			if(!cur) throw new Error("priority queue is empty.");

			if(visited.has(cur)) {
				continue;
			}

			cur.setStyle(Color.curNode).draw(canvas.ctx);
			yield null;

			for(const edge of cur.edges.keys()) {
				edge.bg = Color.compare;
				edge.draw(canvas.ctx);
				yield null;

				const toNode = edge.getToNode(cur);

				if(!distanceTable.value.has(toNode)) {
					distanceTable.value.set(toNode, new DistValue(Infinity, null, edge));
				}

				const newDist = (distanceTable.value.get(cur)?.dist as number) + (edge.weight || 1);

				if((distanceTable.value.get(toNode)?.dist as number) > newDist) {
					distanceTable.value.set(toNode, new DistValue(newDist, cur, edge));
					minQueue.insert(newDist, toNode);
				}
				edge.bg = "#ffffff";
				edge.draw(canvas.ctx);
			}

			cur.setStyle(Color.visited, "#000000").draw(canvas.ctx);
			yield null;
			visited.add(cur);
		}

		let gen = this.finalPath(canvas, endNode);
		while(!gen.next().done) yield null;
	}

	*generatorFn(canvas: CanvasHandler) {
		if(this.startNode && this.endNode) {
			if(this.startNode === this.endNode) {
				return;
			}


			this.startNode.resetStyle();
			this.endNode.resetStyle();
			this.startNode.draw(canvas.ctx);
			this.endNode.draw(canvas.ctx);

			let gen = this.dijkstra(this.startNode, this.endNode, canvas);
			while(!gen.next().done) {
				yield null;
			}
		}
	}
}

export default new Dijkstra();
