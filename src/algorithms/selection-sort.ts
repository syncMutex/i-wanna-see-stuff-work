import { AnimationState, Sorter } from "./sorter-iface.ts";

export default class SelectionSort extends Sorter {
	*sortGenerator() {
		let n = this.elementsCount;
		for(let i = 0; i < n - 1; i++) {
			this.animate(AnimationState.Traversing, i);
			yield null;
			let minIdx = i;
			this.animate(AnimationState.Compare, minIdx);
			for(let j = i + 1; j < n; j++) {
				this.animate(AnimationState.Compare, j);
				yield null;
				this.animate(AnimationState.None, j);
				yield null;
				if(this.elements[j].value < this.elements[minIdx].value) {
					this.animate(AnimationState.None, minIdx);
					minIdx = j;
					this.animate(AnimationState.Compare, minIdx);
					yield null;
				}
			}
			if(i !== minIdx) {
				this.animate(AnimationState.Swap, minIdx, i);
				yield null;
				[this.elements[i].value, this.elements[minIdx].value] = [this.elements[minIdx].value, this.elements[i].value];
				this.animate(AnimationState.SwapDone, minIdx, i);
				yield null;
			}

			this.animate(AnimationState.None, minIdx, i);
			yield null;
		}
	}
}

