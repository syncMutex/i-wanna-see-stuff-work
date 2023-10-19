import { GAP, circleFill, setCanvasSize } from "../canvas";
import { randInt } from "../utils";
import { EventState } from "../handler/event-handler";
import { CanvasHandler } from "../handler/canvas-handler";
import { ToolHandler } from "../handler/tool-handler";
import { ElementLLNode } from "./el-node";
import { Arrow } from "./element-types/arrow";
import { LLNode } from "./element-types/node";

export class ToolLLNode extends ToolHandler {
	constructor() {
		super();
	}

	pointerEnter(_state: EventState, canvas: CanvasHandler) {
		setCanvasSize(canvas.toolCanvas, LLNode.width, LLNode.height);
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

		x = Math.floor(x / GAP) * GAP - LLNode.halfWidth;
		y = Math.floor(y / GAP) * GAP - LLNode.halfHeight;

		x += canvas.offset.x % GAP;
		y += canvas.offset.y % GAP;

		const { x: vx, y: vy } = canvas.toVirtualPosition(x, y);

		const node = new ElementLLNode(vx, vy, String(randInt(1, 500)));
		canvas.add(node, node.arrow);
	}

	pointerMove(state: EventState, canvas: CanvasHandler) {
		let { x, y } = state.pointerMove;

		x = Math.floor(x / GAP) * GAP - LLNode.halfWidth;
		y = Math.floor(y / GAP) * GAP - LLNode.halfHeight;

		x += canvas.offset.x % GAP;
		y += canvas.offset.y % GAP;

		canvas.toolCanvas.style.top = y + "px";
		canvas.toolCanvas.style.left = x + "px";
	}

	static node = new LLNode("");

	static {
		ToolLLNode.node.x = 0;
		ToolLLNode.node.y = 0;
	}

	draw(canvas: HTMLCanvasElement) {
		const ctx = canvas.getContext("2d");
		if(ctx === null) return;

		ToolLLNode.node.paint(ctx);

		const x = LLNode.width - (GAP * 3);
		const c = Arrow.pointingColor;
		circleFill(ctx, (x + LLNode.width) / 2, (0 + LLNode.height) / 2, 4, c);
	}
}
