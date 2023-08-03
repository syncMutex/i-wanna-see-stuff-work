import { ListElement, Sorter, AnimationState } from "./sorter-iface.ts";

export default class BubbleSort extends Sorter {
	constructor() {
		super();
		this.elements = Array<ListElement>(0);
	}

	*sortGenerator() {
		let n = this.elements.length;
		for(let i = 0; i < n - 1; i++) {
			for(let j = 0; j < n - i - 1; j++) {
				this.animate(AnimationState.Traversing, j);
				yield null;
				this.animate(AnimationState.Compare, j, j + 1);
				yield null;
				if(this.elements[j].value > this.elements[j + 1].value) {
					this.animate(AnimationState.Swap, j, j + 1);
					yield null;
					let temp = this.elements[j];
					this.elements[j] = this.elements[j + 1];
					this.elements[j + 1] = temp;
					this.animate(AnimationState.SwapDone, j, j + 1);
					yield null;
				}
				this.animate(AnimationState.None, j, j + 1);
				yield null;
			}
		}
	}
}

