import { ListElement, Sorter, Animate } from "./sorter-iface.ts";

export default class BubbleSort extends Sorter {
	constructor() {
		super();
		this.elements = Array<ListElement>(0);
	}

	private i: number = 0;
	private j: number = 0;

	*sortGenerator() {
		let n = this.elements.length;
		for(this.i = 1; this.i < n; this.i++) { 
			let key = this.elements[this.i];
			this.j = this.i - 1;
			Animate.Traversing(key);
			yield null;
			while(true) {
				if(this.j < 0) {
					break;
				}
				Animate.Traversing(this.elements[this.j]);
				yield null;
				Animate.Compare(this.elements[this.j], key);
				yield null;
				Animate.None(this.elements[this.j], key);
				if(this.elements[this.j].value <= key.value) {
					break;
				}
				Animate.Moving(this.elements[this.j]);
				yield null;
				this.elements[this.j + 1] = this.elements[this.j]; 
				Animate.None(this.elements[this.j]);
				Animate.Moving(this.elements[this.j + 1]);
				yield null;
				Animate.None(this.elements[this.j + 1]);

				this.j--;
				yield null;
			}
			this.elements[this.j + 1] = key; 
			Animate.SwapDone(this.elements[this.j + 1]);
			yield null;
			Animate.None(this.elements[this.j + 1]);
			yield null;
		} 
	}

	resetElements() {
		if(this.j < 0) this.j = 0;
		if(this.elementsCount > 0) {
			Animate.None(this.elements[this.j]);
		}
		if(this.elementsCount > 1) {
			Animate.None(this.elements[this.j + 1]);
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

