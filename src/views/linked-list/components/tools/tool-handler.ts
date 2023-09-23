import { GAP, circleFill, line, setCanvasSize } from "../canvas";
import { EventState } from "../playground/event-handler";
import { CanvasHandler } from "../playground/playground-handler";
import { Arrow, Node } from "../element-types";
import { ElementNode } from "../elements/node";
import { randInt } from "../common-utils";

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
		const node = new Node(String(randInt(1, 500)));
		let { x, y } = state.pointerUp;

		x = Math.floor(x / GAP) * GAP - Node.halfWidth;
		y = Math.floor(y / GAP) * GAP - Node.halfHeight;
		node.setXY(x, y);

		const enode = new ElementNode(node);
		canvas.add(enode, enode.arrow);
	}

	pointerMove(state: EventState, canvas: CanvasHandler) {
		let { x, y } = state.pointerMove;

		x = Math.floor(x / GAP) * GAP - Node.halfWidth;
		y = Math.floor(y / GAP) * GAP - Node.halfHeight;

		canvas.toolCanvas.style.top = y + "px";
		canvas.toolCanvas.style.left = x + "px";
	}

	draw(canvas: HTMLCanvasElement) {
		const ctx = canvas.getContext("2d");
		if(ctx === null) return;

		ctx.fillStyle = Node.bg;
		ctx.fillRect(0, 0, Node.width, Node.height);

		const x = Node.width - (GAP * 3);
		line(ctx, x, 0, x, Node.height, 3, Node.dividerColor);

		const c = Arrow.pointingColor;
		circleFill(ctx, (x + Node.width) / 2, (0 + Node.height) / 2, 4, c);
	}
}

