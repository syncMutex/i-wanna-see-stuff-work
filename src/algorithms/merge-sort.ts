import { ListElement, Sorter } from "./sorter-iface.ts";

export default class MergeSort extends Sorter {
	constructor() {
		super();
		this.elements = Array<ListElement>(0);
	}

	*sortGenerator() {
	}
}
