import { GAP, setCanvasSize } from "../canvas";
import { EventState } from "../playground/event-handler";
import { CanvasHandler } from "../playground/playground-handler";
import { Node } from "../element-types";
import { ElementNode } from "../elements/element-handler";

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
		const node = new Node();
		let { x, y } = state.pointerUp;

		x = Math.floor(x / GAP) * GAP - Node.halfWidth;
		y = Math.floor(y / GAP) * GAP - Node.halfHeight;
		node.setXY(x, y);
		canvas.add(new ElementNode(node));
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

		ctx.fillStyle = "#FFFF00";
		ctx.fillRect(0, 0, Node.width, Node.height);
	}
}
