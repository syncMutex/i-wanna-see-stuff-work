import { AnimationState, Sorter } from "./sorter-iface.ts";

export default class MergeSort extends Sorter {
	*merge(low: number, mid: number, high: number) {
		const n1 = mid - low + 1;
		const n2 = high - mid;
		let left = new Array<number>(n1);
		let right = new Array<number>(n2);

		for(let i = 0; i < n1; i++) {
			left[i] = this.elements[low + i].value;
		}
		for(let i = 0; i < n2; i++) {
			right[i] = this.elements[mid + 1 + i].value;
		}

		let i = 0;
		let j = 0;
		let k = low;

		while(i < n1 && j < n2) {
			let l = left[i];
			let r = right[j];
			if(l <= r) {
				this.elements[k].value = l;
				this.animate(AnimationState.Moving, k);
				yield null;
				this.animate(AnimationState.None, k);
				i++;
			} else {
				this.elements[k].value = r;
				this.animate(AnimationState.Moving, k);
				yield null;
				this.animate(AnimationState.None, k);
				j++;
			}
			k++;
		}

		while(i < n1) {
			this.elements[k].value = left[i];
			this.animate(AnimationState.Moving, k);
			yield null;
			this.animate(AnimationState.None, k);
			i++;
			k++;
		}
		while(j < n2) {
			this.elements[k].value = right[j];
			this.animate(AnimationState.Moving, k);
			yield null;
			this.animate(AnimationState.None, k);
			j++;
			k++;
		}
	}

	*mergeSort(low: number, high: number) {
		if(low < high) {
			let mid = parseInt(((low + high) / 2).toString());

			this.animate(AnimationState.Traversing, mid);
			yield null;
			this.animate(AnimationState.None, mid);

			let leftGen = this.mergeSort(low, mid);
			while(!leftGen.next().done) {
				yield null;
			}
			let rightGen = this.mergeSort(mid + 1, high);
			while(!rightGen.next().done) {
				yield null;
			}
			let mergeGen = this.merge(low, mid, high);
			while(!mergeGen.next().done) {
				yield null;
			}
		}
	}

	*sortGenerator() {
		let mSorter = this.mergeSort(0, this.elements.length - 1);
		while(!mSorter.next().done) {
			yield null;
		}
	}
}
