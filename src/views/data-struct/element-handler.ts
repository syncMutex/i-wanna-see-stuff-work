import { EventState } from "./event-handler";
import { CanvasHandler } from "./playground-handler";

export interface ElementHandler {
	pointerMove: (_state: EventState, _canvas: CanvasHandler) => void;
	pointerEnter: (_state: EventState, _canvas: CanvasHandler) => void;
	pointerLeave: (_state: EventState, _canvas: CanvasHandler) => void;
	pointerDown: (_state: EventState, _canvas: CanvasHandler) => void;
	pointerUp: (_state: EventState, _canvas: CanvasHandler) => null | ElementHandler;
	isIntersect: (_x: number, _y: number) => null | ElementHandler;
	remove: (_canvas: CanvasHandler) => void;
	draw: (_canvas: HTMLCanvasElement) => void;
}

export class Empty implements ElementHandler {
	pointerMove(_state: EventState, _canvas: CanvasHandler) {}
	pointerEnter(_state: EventState, _canvas: CanvasHandler) {}
	pointerLeave(_state: EventState, _canvas: CanvasHandler) {}
	pointerDown(_state: EventState, _canvas: CanvasHandler) {}
	pointerUp(_state: EventState, _canvas: CanvasHandler): null | ElementHandler { return this }
	isIntersect(_x: number, _y: number): null | ElementHandler { return this }
	remove(_canvas: CanvasHandler) {}
	draw(_canvas: HTMLCanvasElement) {}
}

