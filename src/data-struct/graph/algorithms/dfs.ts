import { Ref, ref } from "vue";
import { AlgorithmHandler } from "../../algorithm-handler";
import { CanvasHandler } from "../../handler/canvas-handler.ts";
import { ElementGNode } from "../el-node.ts";
import { ElementUEdge } from "../el-u-edge.ts";

enum Color {
	visited = "#00ff00"
};

class Dfs extends AlgorithmHandler {
	startNode: null | ElementGNode = null;

	visited: Ref<Set<ElementGNode>> = ref(new Set<ElementGNode>());

	init(node: ElementGNode) {
		this.startNode = node;
		this.visited = ref(new Set<ElementGNode>());
	}

	*dfsUEdge(node: ElementGNode, canvas: CanvasHandler) {
		this.visited.value.add(node);
		node.bg = Color.visited;

		node.draw(canvas.ctx);
		yield null;

		for(let n of node.edges.keys()) {
			n.bg = "#ffff00";
			n.draw(canvas.ctx);
			yield null;
			n.bg = "#ffffff";
			n.draw(canvas.ctx);

			let temp = (n.toNode === node) ? n.fromNode : n.toNode;

			if(!this.visited.value.has(temp)) {
				let gen = this.dfsUEdge(temp, canvas);
				while(!gen.next().done) {
					yield null;
				}
			}
		}
	}

	*dfsDEdge(node: ElementGNode, canvas: CanvasHandler) {
		this.visited.value.add(node);
		node.bg = Color.visited;

		node.draw(canvas.ctx);
		yield null;

		for(let n of node.edges.keys()) {
			n.bg = "#ffff00";
			n.draw(canvas.ctx);
			yield null;
			n.bg = "#ffffff";
			n.draw(canvas.ctx);

			let temp = n.toNode;

			if(!this.visited.value.has(temp)) {
				let gen = this.dfsDEdge(temp, canvas);
				while(!gen.next().done) {
					yield null;
				}
			}
		}
	}

	uninit(canvas: CanvasHandler) {
		this.startNode = null;
		for(let n of this.visited.value) {
			n.edges.forEach((_, e) => e.bg = "#ffffff");
			n.resetStyle();
		}
		canvas.redraw();
	}

	*generatorFn(canvas: CanvasHandler) {
		if(this.startNode) {
			let gen;
			if(this.startNode.edges.keys().next().value.constructor.name === ElementUEdge.name) {
				gen = this.dfsUEdge(this.startNode, canvas);
			} else {
				gen = this.dfsDEdge(this.startNode, canvas);
			}

			while(!gen.next().done) {
				yield null;
			}
		}
	}
}

export default new Dfs();
