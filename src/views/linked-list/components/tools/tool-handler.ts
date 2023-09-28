import { GAP, circleFill, setCanvasSize } from "../canvas";
import { EventState } from "../playground/event-handler";
import { CanvasHandler } from "../playground/playground-handler";
import { randInt } from "../common-utils";
import { ElementNode } from "../elements/el-node";
import { Node } from "../elements/element-types/node";
import { Arrow } from "../elements/element-types/arrow";

export class ToolHandler {
	constructor() {}

	pointerMove(_state: EventState, _canvas: CanvasHandler) {}
	pointerEnter(_state: EventState, _canvas: CanvasHandler) {}
	pointerLeave(_state: EventState, _canvas: CanvasHandler) {}
	pointerDown(_state: EventState, _canvas: CanvasHandler) {}
	pointerUp(_state: EventState, _canvas: CanvasHandler) {}

	draw(_canvas: HTMLCanvasElement) {}
}

export class ToolNode extends ToolHandler {
	constructor() {
		super();
	}

	pointerEnter(_state: EventState, canvas: CanvasHandler) {
		setCanvasSize(canvas.toolCanvas, Node.width, Node.height);
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

		x = Math.floor(x / GAP) * GAP - Node.halfWidth;
		y = Math.floor(y / GAP) * GAP - Node.halfHeight;

		const enode = new ElementNode(x, y, String(randInt(1, 500)));
		canvas.add(enode, enode.arrow);
	}

	pointerMove(state: EventState, canvas: CanvasHandler) {
		let { x, y } = state.pointerMove;

		x = Math.floor(x / GAP) * GAP - Node.halfWidth;
		y = Math.floor(y / GAP) * GAP - Node.halfHeight;

		canvas.toolCanvas.style.top = y + "px";
		canvas.toolCanvas.style.left = x + "px";
	}

	static node = new Node("");

	static {
		ToolNode.node.x = 0;
		ToolNode.node.y = 0;
	}

	draw(canvas: HTMLCanvasElement) {
		const ctx = canvas.getContext("2d");
		if(ctx === null) return;

		ToolNode.node.paint(ctx);

		const x = Node.width - (GAP * 3);
		const c = Arrow.pointingColor;
		circleFill(ctx, (x + Node.width) / 2, (0 + Node.height) / 2, 4, c);
	}
}
