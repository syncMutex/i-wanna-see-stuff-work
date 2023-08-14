import { Sorter, AnimationState } from "./sorter-iface.ts";

export default class BubbleSort extends Sorter {
	constructor(cb: () => void) {
		super(cb);
	}

	*sortGenerator() {
		let n = this.elements.length;
		for(let i = 1; i < n; i++) { 
			let key = this.elements[i];
			let j = i - 1;

			this.animate(AnimationState.Traversing, i);
			yield null;

			while(true) {
				if(j < 0) {
					break;
				}
				this.animate(AnimationState.Traversing, j);
				yield null;
				this.animate(AnimationState.Compare, j);
				yield null;
				this.animate(AnimationState.None, j, i);
				if(this.elements[j].value <= key.value) {
					break;
				}
				this.animate(AnimationState.Moving, j);
				yield null;
				this.elements[j + 1] = this.elements[j]; 
				this.animate(AnimationState.None, j);
				this.animate(AnimationState.Moving, j + 1);
				yield null;
				this.animate(AnimationState.None, j + 1);

				j--;
				yield null;
			}
			this.elements[j + 1] = key; 
			this.animate(AnimationState.SwapDone, j + 1);
			yield null;
			this.animate(AnimationState.None, j + 1);
			yield null;
		} 
	}
}

