import { ListElement, Sorter, AnimationState } from "./sorter-iface.ts";

export default class BubbleSort extends Sorter {
	constructor() {
		super();
		this.elements = Array<ListElement>(0);
	}

	*sortGenerator() {
	}

	private resetElements() {
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

