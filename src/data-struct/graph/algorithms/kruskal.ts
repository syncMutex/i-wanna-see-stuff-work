import { AlgorithmHandler } from "../../algorithm-handler";
import { CanvasHandler } from "../../handler/canvas-handler.ts";
import { ElementGNode } from "../el-node.ts";
import { ElementUEdge } from "../el-u-edge.ts";
import { ElementDEdge } from "../el-d-edge.ts";
import { Ref, ref } from "vue";

enum Color {
	span = "#00ff00",
	curNode = "#0000ff",
	compare = "#ffff00",
	cycle = "#ff0000"
};

class Kruskal extends AlgorithmHandler {
	startNode: null | ElementGNode = null;
	visited: Set<ElementGNode> = new Set();
	edges: Ref<Array<ElementUEdge>> = ref([]);
	mst: Array<ElementUEdge> = [];
	parent: Map<ElementGNode, ElementGNode> = new Map();
	rank: Map<ElementGNode, number> = new Map();

	init(startNode: ElementGNode) {
		this.startNode = startNode;
		this.visited = new Set();
		this.parent = new Map();
		this.rank = new Map();
		this.edges.value = [];
		this.mst = [];
	}

	uninit(_canvas: CanvasHandler) {
	}

	cleanup(canvas: CanvasHandler) {
		for(let edge of this.mst) {
			let fromNode = edge.fromNode;
			let toNode = edge.toNode;

			fromNode.resetStyle();
			toNode.resetStyle();

			fromNode.draw(canvas.ctx);
			toNode.draw(canvas.ctx);

			edge.bg = "#ffffff";
			edge.draw(canvas.ctx);
		}
	}

	forceStop(canvas: CanvasHandler): void {
		super.forceStop(canvas);
		this.cleanup(canvas);
	}

	bfs(node: ElementGNode, edges: Set<ElementUEdge>) {
		this.visited.add(node);
		let queue: Array<ElementGNode> = [];

		queue.push(node);
		
		while(queue.length) {
			let front = queue.shift() as ElementGNode;

			for(let n of front.edges.keys()) {
				let temp = (n.toNode === front) ? n.fromNode : n.toNode;
				edges.add(n as ElementUEdge);
				if(!this.visited.has(temp)) {
					this.visited.add(temp);
					queue.push(temp);
				}
			}
		}
	}

	getEdgeList(startNode: ElementGNode) {
		let edges: Set<ElementUEdge> = new Set();
		this.bfs(startNode, edges);
		return [...edges].sort((a, b) => a.weight - b.weight);
	}

	find(node: ElementGNode): ElementGNode {
		let root = node;

		if(!this.parent.has(node)) {
			this.parent.set(node, node);
		}

		while(this.parent.get(node) !== root) {
			root = this.parent.get(node) as ElementGNode;
		}
		return root;
	}

	union(a: ElementGNode, b: ElementGNode) {
		let u = this.find(a);
		let v = this.find(b);

		if(!this.rank.has(u)) {
			this.rank.set(u, 0);
		}

		if(!this.rank.has(v)) {
			this.rank.set(v, 0);
		}

		if(u !== v) {
			if((this.rank.get(u) as number) < (this.rank.get(v) as number)) {
				[u, v] = [v, u];
			}
			this.parent.set(v, u);

			let ru = this.rank.get(u) as number;

			if(ru === (this.rank.get(v) as number)) {
				this.rank.set(u, ru + 1);
			}
		}
	}

	isConnected(a: ElementGNode, b: ElementGNode): boolean {
		return this.find(a) === this.find(b);
	}

	*kruskal(startNode: ElementGNode, canvas: CanvasHandler) {
		this.edges.value = this.getEdgeList(startNode);

		for(let i = 0; i < this.edges.value.length; i++) {
			const edge = this.edges.value[i];
			let fromNode = edge.fromNode;
			let toNode = edge.toNode;

			if(!this.isConnected(fromNode, toNode)) {
				this.mst.push(edge);

				fromNode.bg = Color.span;
				fromNode.color = "#000000";
				fromNode.draw(canvas.ctx);
				yield null;

				edge.bg = Color.span;
				edge.draw(canvas.ctx);
				yield null;

				toNode.bg = Color.span;
				toNode.color = "#000000";
				toNode.draw(canvas.ctx);
				yield null;

				this.union(fromNode, toNode);
			} else {
				const fromPrevBg = fromNode.bg;
				const fromPrevColor = fromNode.color;
				const prevEdgeBg = edge.bg;
				const toPrevBg = fromNode.bg;
				const toPrevColor = fromNode.color;

				fromNode.bg = Color.cycle;
				fromNode.color = "#ffffff";
				fromNode.draw(canvas.ctx);

				edge.bg = Color.cycle;
				edge.draw(canvas.ctx);

				toNode.bg = Color.cycle;
				toNode.color = "#ffffff";
				toNode.draw(canvas.ctx);
				yield null;

				fromNode.bg = fromPrevBg;
				fromNode.color = fromPrevColor;
				fromNode.draw(canvas.ctx);

				edge.bg = prevEdgeBg;
				edge.draw(canvas.ctx);

				toNode.bg = toPrevBg;
				toNode.color = toPrevColor;
				toNode.draw(canvas.ctx);
			}
		}
	}

	*generatorFn(canvas: CanvasHandler) {
		if(this.startNode) {
			if(this.startNode.edges.keys().next().value.constructor.name === ElementDEdge.name) {
				return;
			}

			let gen = this.kruskal(this.startNode, canvas);

			while(!gen.next().done) {
				yield null;
			}
		}
	}
}

export default new Kruskal();
