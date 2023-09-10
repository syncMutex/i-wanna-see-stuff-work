import { Playground } from "./playground-handler";

export interface EventState {
	pointerDown: { x: number, y: number };
	pointerMove: { x: number, y: number };
	pointerUp: { x: number, y: number }
}

export class EventHandler {
	state: EventState = {
		pointerDown: { x: -1, y: -1 },
		pointerMove: { x: -1, y: -1 },
		pointerUp: { x: -1, y: -1 }
	};

	getRelXY(e: any) {
		const rect = (e.target as any).getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		return { x, y };
	}

	pointerEnter(_e: MouseEvent, pgnd: Playground) {
		pgnd.toolHandler?.pointerEnter(this.state, pgnd.canvas);
	}

	pointerLeave(_e: MouseEvent, pgnd: Playground) {
		pgnd.toolHandler?.pointerLeave(this.state, pgnd.canvas);
	}

	pointerDown(e: PointerEvent, pgnd: Playground) {
		if(e.target === null) return;
		this.state.pointerDown = this.getRelXY(e);
		pgnd.toolHandler?.pointerDown(this.state, pgnd.canvas);
	}

	pointerUp(e: PointerEvent, pgnd: Playground) {
		if(e.target === null) return;
		this.state.pointerUp = this.getRelXY(e);
		pgnd.toolHandler?.pointerUp(this.state, pgnd.canvas);
	}

	pointerMove(e: PointerEvent, pgnd: Playground) {
		if(e.target === null) return;
		this.state.pointerMove = this.getRelXY(e);
		pgnd.toolHandler?.pointerMove(this.state, pgnd.canvas);
	}
}

