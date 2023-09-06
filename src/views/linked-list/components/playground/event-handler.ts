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

	pointerEnter(_e: MouseEvent, playground: Playground) {
		playground.tool?.pointerEnter(playground);
	}

	pointerLeave(_e: MouseEvent, playground: Playground) {
		playground.tool?.pointerLeave(playground);
	}

	pointerDown(e: PointerEvent, pgnd: Playground) {
		if(pgnd.playgroundCanvas === null || pgnd.toolCanvas === null || pgnd.tool === null) return;
		if(e.target === null) return;
		this.state.pointerDown = this.getRelXY(e);
		pgnd.tool.pointerDown(pgnd, this.state);
	}

	pointerUp(e: PointerEvent, pgnd: Playground) {
		if(pgnd.playgroundCanvas === null || pgnd.toolCanvas === null || pgnd.tool === null) return;
		if(e.target === null) return;
		this.state.pointerUp = this.getRelXY(e);
		pgnd.tool.pointerUp(pgnd, this.state);
	}

	pointerMove(e: PointerEvent, pgnd: Playground) {
		if(pgnd.playgroundCanvas === null || pgnd.toolCanvas === null || pgnd.tool === null) return;
		if(e.target === null) return;
		this.state.pointerMove = this.getRelXY(e);
		pgnd.tool.pointerMove(pgnd, this.state);
	}
}

