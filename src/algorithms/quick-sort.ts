import { ListElement, Sorter } from "./sorter-iface.ts";

export default class QuickSort extends Sorter {
	constructor() {
		super();
		this.elements = Array<ListElement>(0);
	}

	*sortGenerator() {
	}
}

