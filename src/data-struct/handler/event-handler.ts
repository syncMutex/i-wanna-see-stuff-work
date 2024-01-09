import { disablePointerEvents, focusElement } from "../global";
import { Playground } from "./playground-handler";
import { isMenuOpen, setIsMenuOpen } from "../components/refs";

export type EventState = {
	pointerDown: { x: number, y: number };
	pointerMove: { x: number, y: number, e: any };
	pointerUp: { x: number, y: number }
}

export class EventHandler {
	state: EventState = {
		pointerDown: { x: -1, y: -1 },
		pointerMove: { x: -1, y: -1, e: null },
		pointerUp: { x: -1, y: -1 }
	};

	getRelXY(e: any) {
		const rect = (e.target as any).getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		return { x, y, e };
	}

	pointerEnter(_e: MouseEvent, pgnd: Playground) {
		if(pgnd.toolHandler) {
			pgnd.toolHandler.pointerEnter(this.state, pgnd.canvas);
		} else if(pgnd.elementHandler) {
			pgnd.elementHandler.pointerEnter(this.state, pgnd.canvas);
		}
	}

	pointerLeave(_e: MouseEvent, pgnd: Playground) {
		if(pgnd.toolHandler) {
			pgnd.toolHandler.pointerLeave(this.state, pgnd.canvas);
		} else if(pgnd.elementHandler) {
			pgnd.elementHandler.pointerLeave(this.state, pgnd.canvas);
		}
	}

	pointerDown(e: PointerEvent, pgnd: Playground) {
		disablePointerEvents.value = true;
		if(e.target === null) return;
		if(isMenuOpen) setIsMenuOpen(false);
		this.state.pointerDown = this.getRelXY(e);
		pgnd.elementHandler = pgnd.canvas.findIntersection(this.state.pointerDown.x, this.state.pointerDown.y);

		if(pgnd.toolHandler) {
			pgnd.toolHandler.pointerDown(this.state, pgnd.canvas);
		} else if(pgnd.elementHandler) {
			pgnd.elementHandler.pointerDown(this.state, pgnd.canvas);
			focusElement(pgnd.elementHandler);
			pgnd.canvas.redraw();
		}
	}

	resetState() {
		this.state.pointerDown = { x: -1, y: -1 };
		this.state.pointerMove = { x: -1, y: -1, e: null };
	}

	pointerUp(e: PointerEvent, pgnd: Playground) {
		disablePointerEvents.value = false;
		if(e.target === null) return;
		this.state.pointerUp = this.getRelXY(e);
		if(pgnd.toolHandler) {
			pgnd.toolHandler.pointerUp(this.state, pgnd.canvas);
		} else if(pgnd.elementHandler) {
			pgnd.elementHandler = pgnd.elementHandler.pointerUp(this.state, pgnd.canvas);
		}
		this.resetState();
	}

	pointerMove(e: PointerEvent, pgnd: Playground) {
		if(e.target === null) return;
		this.state.pointerMove = this.getRelXY(e);
		if(pgnd.toolHandler) {
			pgnd.toolHandler.pointerMove(this.state, pgnd.canvas);
		} else if(pgnd.elementHandler) {
			pgnd.elementHandler.pointerMove(this.state, pgnd.canvas);
		}
	}
}

