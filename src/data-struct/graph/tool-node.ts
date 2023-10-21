import { GAP, setCanvasSize } from "../canvas";
import { randInt } from "../utils";
import { EventState } from "../handler/event-handler";
import { CanvasHandler } from "../handler/canvas-handler";
import { ToolHandler } from "../handler/tool-handler";
import { ElementGNode } from "./el-node";
import { GNode } from "./element-types/node";

export class ToolGNode extends ToolHandler {
	constructor() {
		super();
	}

	pointerEnter(_state: EventState, canvas: CanvasHandler) {
		setCanvasSize(canvas.toolCanvas, GNode.radius * 2, GNode.radius * 2);
		this.draw(canvas.toolCanvas);
	}

	pointerLeave(_state: EventState, canvas: CanvasHandler) {
		setCanvasSize(canvas.toolCanvas, 0, 0);
	}

	pointerDown(_state: EventState, _canvas: CanvasHandler) {
	}

	pointerUp(state: EventState, canvas: CanvasHandler) {
		if(
			state.pointerDown.y !== state.pointerUp.y ||
			state.pointerUp.x !== state.pointerDown.x
		) return;
		let { x, y } = state.pointerUp;

		x = Math.floor(x / GAP) * GAP;
		y = Math.floor(y / GAP) * GAP;

		x += canvas.offset.x % GAP;
		y += canvas.offset.y % GAP;

		const { x: vx, y: vy } = canvas.toVirtualPosition(x, y);

		const node = new ElementGNode(vx, vy, String(randInt(1, 500)));
		canvas.add(node);
	}

	pointerMove(state: EventState, canvas: CanvasHandler) {
		let { x, y } = state.pointerMove;

		x = Math.floor(x / GAP) * GAP - GNode.radius;
		y = Math.floor(y / GAP) * GAP - GNode.radius;

		x += canvas.offset.x % GAP;
		y += canvas.offset.y % GAP;

		canvas.toolCanvas.style.top = y + "px";
		canvas.toolCanvas.style.left = x + "px";
	}

	static node = new GNode("");

	static {
		ToolGNode.node.x = GNode.radius;
		ToolGNode.node.y = GNode.radius;
	}

	draw(canvas: HTMLCanvasElement) {
		const ctx = canvas.getContext("2d");
		if(ctx === null) return;

		ToolGNode.node.paint(ctx);
	}
}