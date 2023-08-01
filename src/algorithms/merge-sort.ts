import { ListElement, Sorter, AnimationState } from "./sorter-iface.ts";

export default class MergeSort extends Sorter {
	constructor() {
		super();
		this.elements = Array<ListElement>(0);
	}

	private i = 0;
	private j = 0;

	*sortGenerator() {
		let n = this.elements.length;
		for(this.i = 0; this.i < n - 1; this.i++) {
			for(this.j = 0; this.j < n - this.i - 1; this.j++) {
				this.elements[this.j].state = AnimationState.Traversing;
				yield null;
				this.elements[this.j].state = AnimationState.Compare;
				this.elements[this.j + 1].state = AnimationState.Compare;
				yield null;
				if(this.elements[this.j].value > this.elements[this.j + 1].value) {
					this.elements[this.j].state = AnimationState.Swap;
					this.elements[this.j + 1].state = AnimationState.Swap;
					yield null;
					let temp = this.elements[this.j];
					this.elements[this.j] = this.elements[this.j + 1];
					this.elements[this.j + 1] = temp;
					this.elements[this.j].state = AnimationState.SwapDone;
					this.elements[this.j + 1].state = AnimationState.SwapDone;
					yield null;
				}
				this.elements[this.j].state = AnimationState.None;
				this.elements[this.j + 1].state = AnimationState.None;
				yield null;
			}
		}
	}
}
