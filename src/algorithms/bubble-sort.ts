import { ListElement, Sorter, AnimationState, randomInt } from "./sorter-iface.ts";

export default class BubbleSort implements Sorter {
	public elements: Array<ListElement>;

	constructor() {
		this.elements = Array<ListElement>(0);
	}

	changeElementsCount(count: number) {
		let newElements = Array<ListElement>(count);
		for(let i = 0; i < count; i++) {
			newElements[i] = { value: randomInt(10, 600), state: AnimationState.None };
		}
		this.elements = newElements;
	}

	setElements(elements: Array<ListElement>) {
		this.elements = elements;
	}

	get elementsCount() {
		return this.elements.length;
	}

	shuffle() {
	}

	play() {
	}

	pause() {
	}

	next() {
	}

	reset() {
		this.changeElementsCount(5);
	}

	changeValues() {
		this.changeElementsCount(this.elementsCount);
	}
}
