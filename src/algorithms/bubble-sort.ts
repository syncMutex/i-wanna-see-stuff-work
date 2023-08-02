import { ListElement, Sorter, AnimationState, Animate } from "./sorter-iface.ts";

export default class BubbleSort extends Sorter {
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
				Animate.Traversing(this.elements[this.j]);
				yield null;
				Animate.Compare(this.elements[this.j], this.elements[this.j + 1]);
				yield null;
				if(this.elements[this.j].value > this.elements[this.j + 1].value) {
					Animate.Swap(this.elements[this.j], this.elements[this.j + 1]);
					yield null;
					let temp = this.elements[this.j];
					this.elements[this.j] = this.elements[this.j + 1];
					this.elements[this.j + 1] = temp;
					Animate.SwapDone(this.elements[this.j], this.elements[this.j + 1]);
					yield null;
				}
				Animate.None(this.elements[this.j], this.elements[this.j + 1]);
				yield null;
			}
		}
	}

	resetElements() {
		if(this.elementsCount > 0) {
			this.elements[this.j].state = AnimationState.None;
		}
		if(this.elementsCount > 1) {
			this.elements[this.j + 1].state = AnimationState.None;
		}
	  this.i = 0;
		this.j = 0;
	}

	shuffle(): void {
		this.resetElements();
		super.shuffle();
	}

	reset(): void {
		this.resetElements();
		super.reset();
	}

	changeValues(): void {
		this.resetElements();
		super.changeValues();
	}

	changeElementsCount(count: number): void {
		this.resetElements();
		super.changeElementsCount(count);
	}
}

