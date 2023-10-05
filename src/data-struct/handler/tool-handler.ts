import { EventState } from "./event-handler";
import { CanvasHandler } from "./canvas-handler";

export class ToolHandler {
	constructor() {}

	pointerMove(_state: EventState, _canvas: CanvasHandler) {}
	pointerEnter(_state: EventState, _canvas: CanvasHandler) {}
	pointerLeave(_state: EventState, _canvas: CanvasHandler) {}
	pointerDown(_state: EventState, _canvas: CanvasHandler) {}
	pointerUp(_state: EventState, _canvas: CanvasHandler) {}

	draw(_canvas: HTMLCanvasElement) {}
}

