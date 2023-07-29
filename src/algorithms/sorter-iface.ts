export enum AnimationState {
	None
};

export interface ListElement {
	value: number;
	state: AnimationState;
};

export interface Sorter {
	elements: Array<ListElement>;
	setElements: (elements:Array<ListElement>) => void; 
	changeElementsCount: (count: number) => void;
	shuffle: () => void,
	play: () => void,
	pause: () => void,
	next: () => void,
	reset: () => void,
	changeValues: () => void,
}

export function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min) + min); 
}

export enum SortingAlgorithm {
	BubbleSort,
	InsertionSort,
	SelectionSort,
	MergeSort,
	QuickSort
};
