import { ELEMENT, Empty } from "../element-types";
import { EventState } from "../playground/event-handler";
import { CanvasHandler } from "../playground/playground-handler";

export class ElementHandler {
	constructor() {}

	el: ELEMENT = new Empty;

	pointerMove(_state: EventState, _canvas: CanvasHandler) {}
	pointerEnter(_state: EventState, _canvas: CanvasHandler) {}
	pointerLeave(_state: EventState, _canvas: CanvasHandler) {}
	pointerDown(_state: EventState, _canvas: CanvasHandler) {}
	pointerUp(_state: EventState, _canvas: CanvasHandler): null | ElementHandler { return null }

	isIntersect(_x: number, _y: number): null | ElementHandler { return null; }

	draw(_canvas: HTMLCanvasElement) {}
}

