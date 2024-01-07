import { ShallowRef, shallowRef } from "vue";
import { AlgorithmHandler } from "../../algorithm-handler";
import { CanvasHandler } from "../../handler/canvas-handler.ts";
import { ElementGNode } from "../el-node.ts";
import { ElementUEdge } from "../el-u-edge.ts";

enum Color {
	visited = "#00ff00"
};

class Dfs extends AlgorithmHandler {
	startNode: null | ElementGNode = null;

	visited: ShallowRef<Set<ElementGNode>> = shallowRef(new Set<ElementGNode>());

	init(node: ElementGNode) {
		this.startNode = node;
		this.visited.value = new Set<ElementGNode>();
	}

	*dfsUEdge(node: ElementGNode, canvas: CanvasHandler) {
		this.visited.value.add(node);
		this.visited.value = new Set([...this.visited.value]);
		node.bg = Color.visited;

		node.borderColor = "#0000ff";
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
				node.borderColor = "";
				canvas.redraw();
				while(!gen.next().done) {
					yield null;
				}
				node.borderColor = "#0000ff";
				canvas.redraw();
			}
		}
		node.borderColor = "";
		canvas.redraw();
	}

	*dfsDEdge(node: ElementGNode, canvas: CanvasHandler) {
		this.visited.value.add(node);
		this.visited.value = new Set([...this.visited.value]);
		node.bg = Color.visited;

		node.borderColor = "#0000ff";
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
				node.borderColor = "";
				canvas.redraw();
				while(!gen.next().done) {
					yield null;
				}
				node.borderColor = "#0000ff";
				canvas.redraw();
			}
		}
		node.borderColor = "";
		canvas.redraw();
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
