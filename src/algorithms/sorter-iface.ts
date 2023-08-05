export enum AnimationState {
	None = "none",
	Traversing = "traversing",
	Compare = "compare",
	Swap = "swap",
	SwapDone = "swap-done",
	Moving = "moving"
};

export interface ListElement {
	value: number;
	state: AnimationState;
};

enum SorterState {
	NotBegun = 1,
	Stopped,
	Paused,
	Running
}

export class Sorter {
	public elements: Array<ListElement>;
	private delay: number = 50;
	private state: SorterState = SorterState.NotBegun;
	private generator: Generator<null, void, unknown> | null = null;

	constructor() {
		this.elements = Array<ListElement>(0);
	}

	private notNones = new Set<number>();

	animate(state: AnimationState, ...args: number[]) {
		for(let i = 0; i < args.length; i++) {
			if(this.elements[args[i]] != undefined) {
				this.elements[args[i]].state = state;
				if(state !== AnimationState.None) {
					this.notNones.add(args[i]);
				} else {
					this.notNones.delete(args[i]);
				}
			}
		}
	}

	resetElements() {
		this.notNones.forEach(v => {
			if(this.elements[v] === undefined) {
				return;
			}
			this.elements[v].state = AnimationState.None;
		});
		this.notNones.clear();
	}

	setAnimationDelay(d: number) {
		if(d <= 0) {
			return;
		} 
		this.delay = d;
	}

	changeElementsCount(count: number) {
		this.resetElements();
		this.stop();

		let newElements = Array<ListElement>(count);
		for(let i = 0; i < count; i++) {
			newElements[i] = { value: randomInt(10, 600), state: AnimationState.None };
		}
		this.setElements(newElements);
	}

	setElements(elements: Array<ListElement>) {
		this.elements = elements;
		this.generator = this.sortGenerator();
	}

	get elementsCount() {
		return this.elements.length;
	}

	shuffle() {
		this.resetElements();
		this.stop();

		let elements = [...this.elements];
		for(let i = 0; i < 20; i++) {
			let i = randomInt(0, elements.length);
			let j = randomInt(0, elements.length);
			[elements[i], elements[j]] = [elements[j], elements[i]];
		}
		this.setElements(elements);
	}

	run() {
		return new Promise((resolve, _) => {
			setTimeout(() => {
				if(this.state === SorterState.Stopped) {
					resolve(false);
					return;
				}
				this.next();
				if(this.state !== SorterState.Running) {
					resolve(false);
					return;
				}
				resolve(true);
			}, this.delay);
		});
	}

	async play() {
		this.state = SorterState.Running;
		if(this.generator === null) {
			this.generator = this.sortGenerator();
		}

		while(await this.run());
	}

	pause() {
		this.state = SorterState.Paused;
	}

	stop() {
		if(this.state === SorterState.Stopped || this.state === SorterState.NotBegun) return;
		this.state = SorterState.Stopped;
		this.generator = null;
	}

	next() {
		if(this.generator?.next().done) {
			this.stop();
		}
	}

	*sortGenerator() {
		yield null;
		/* implemented by child class */
	}

	reset() {
		this.changeElementsCount(5);
	}

	changeValues() {
		this.resetElements();
		this.changeElementsCount(this.elementsCount);
	}
}

export function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min) + min); 
}

export enum SortingAlgorithm {
	BubbleSort = "bubble sort",
	InsertionSort = "insertion sort",
	SelectionSort = "selection sort",
	MergeSort = "merge sort",
	QuickSort = "quick sort"
}
