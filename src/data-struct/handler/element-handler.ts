import { EventState } from "./event-handler";
import { Point } from "../geometry";
import { CanvasHandler } from "./canvas-handler";

export interface ElementHandler {
	pointerMove: (_state: EventState, _canvas: CanvasHandler) => void;
	pointerEnter: (_state: EventState, _canvas: CanvasHandler) => void;
	pointerLeave: (_state: EventState, _canvas: CanvasHandler) => void;
	pointerDown: (_state: EventState, _canvas: CanvasHandler) => void;
	pointerUp: (_state: EventState, _canvas: CanvasHandler) => null | ElementHandler;
	isIntersect: (_x: number, _y: number, offset: Point, canvas: CanvasHandler) => null | ElementHandler;
	remove: (_canvas: CanvasHandler) => void;
	draw: (_ctx: CanvasRenderingContext2D) => void;
	focus: () => void;
	unfocus: () => void;
}

export class ElementPan implements ElementHandler {
	tempOff = { x: -1, y: -1 };
	pointerMove(state: EventState, canvas: CanvasHandler) {
		if(state.pointerDown.x === -1) return;
		let dx = state.pointerMove.x - state.pointerDown.x;
		let dy = state.pointerMove.y - state.pointerDown.y;

		canvas.panTo(this.tempOff.x + dx, this.tempOff.y + dy);
		canvas.redraw();
	}

	pointerEnter(_state: EventState, _canvas: CanvasHandler) {}
	pointerLeave(_state: EventState, _canvas: CanvasHandler) {
		_state.pointerDown = { x: -1, y: -1 };
	}

	pointerDown(_state: EventState, canvas: CanvasHandler) {
		this.tempOff = { ...canvas.offset };
	}

	pointerUp(_state: EventState, _canvas: CanvasHandler): null | ElementHandler { return this }
	isIntersect(_x: number, _y: number, _offset: Point, _canvas: CanvasHandler): null | ElementHandler { return this }
	remove(_canvas: CanvasHandler) {}
	draw(_ctx: CanvasRenderingContext2D) {}
	focus() {}
	unfocus() {}
}

export const panHandler = new ElementPan();
