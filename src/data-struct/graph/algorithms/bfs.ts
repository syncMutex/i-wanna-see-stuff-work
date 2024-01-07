import { ShallowReactive, ShallowRef, shallowReactive, shallowRef } from "vue";
import { AlgorithmHandler } from "../../algorithm-handler";
import { CanvasHandler } from "../../handler/canvas-handler.ts";
import { ElementGNode } from "../el-node.ts";
import { ElementUEdge } from "../el-u-edge.ts";

enum Color {
	visited = "#00ff00"
};

class Bfs extends AlgorithmHandler {
	startNode: null | ElementGNode = null;

	visited: ShallowRef<Set<ElementGNode>> = shallowRef(new Set<ElementGNode>());
	queue: ShallowReactive<Array<ElementGNode>> = shallowReactive([1, 2, 3, 4, 4, 5, 7, 7, 32, 51].map((v) => new ElementGNode(0, 0, String(v)))); 

	init(node: ElementGNode) {
		this.startNode = node;
		this.visited.value = new Set<ElementGNode>();
		this.queue = [];
	}

	*bfsUEdge(node: ElementGNode, canvas: CanvasHandler) {
		this.visited.value.add(node);
		this.visited.value = new Set([...this.visited.value]);

		this.queue.push(node);
		yield null;
		
		while(this.queue.length) {
			let front = this.queue.shift();
			yield null;

			if(!front) {
				return;
			}

			front.bg = Color.visited;
			front.borderColor = "#0000ff";
			front.draw(canvas.ctx);
			yield null;

			for(let n of front.edges.keys()) {
				n.bg = "#ffff00";
				n.draw(canvas.ctx);
				yield null;
				n.bg = "#ffffff";
				n.draw(canvas.ctx);

				let temp = (n.toNode === front) ? n.fromNode : n.toNode;

				if(!this.visited.value.has(temp)) {
					this.visited.value.add(temp);
					this.visited.value = new Set([...this.visited.value]);
					temp.bg = "#a200ff";
					temp.draw(canvas.ctx);
					this.queue.push(temp);
					yield null;
				}
			}
			front.borderColor = "";
			canvas.redraw();
		}
	}

	*bfsDEdge(node: ElementGNode, canvas: CanvasHandler) {
		this.visited.value.add(node);
		this.visited.value = new Set([...this.visited.value]);

		this.queue.push(node);
		yield null;
		
		while(this.queue.length) {
			let front = this.queue.shift();
			yield null;

			if(!front) {
				return;
			}

			front.bg = Color.visited;
			front.borderColor = "#0000ff";
			front.draw(canvas.ctx);
			yield null;

			for(let n of front.edges.keys()) {
				n.bg = "#ffff00";
				n.draw(canvas.ctx);
				yield null;
				n.bg = "#ffffff";
				n.draw(canvas.ctx);

				let temp = n.toNode;

				if(!this.visited.value.has(temp)) {
					this.visited.value.add(temp);
					this.visited.value = new Set([...this.visited.value]);
					temp.bg = "#a200ff";
					temp.draw(canvas.ctx);
					this.queue.push(temp);
					yield null;
				}
			}
			front.borderColor = "";
			canvas.redraw();
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
				gen = this.bfsUEdge(this.startNode, canvas);
			} else {
				gen = this.bfsDEdge(this.startNode, canvas);
			}

			while(!gen.next().done) {
				yield null;
			}
		}
	}
}

export default new Bfs();
