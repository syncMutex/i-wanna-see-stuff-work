export enum AnimationState {
	None = "none",
	Traversing = "traversing",
	Compare = "compare",
	Swap = "swap",
	SwapDone = "swap-done",
	Moving = "moving"
};

function animationSet(args: Array<ListElement>, state: AnimationState) {
	for(let i = 0; i < args.length; i++) {
		if(args[i] != undefined) {
			args[i].state = state;
		}
	}
}

export const Animate = {
	None(...args: Array<ListElement>) {
		animationSet(args, AnimationState.None);
	},
	Traversing(...args: Array<ListElement>) {
		animationSet(args, AnimationState.Traversing);
	},
	Compare(...args: Array<ListElement>) {
		animationSet(args, AnimationState.Compare)
	},
	Swap(...args: Array<ListElement>) {
		animationSet(args, AnimationState.Swap);
	},
	SwapDone(...args: Array<ListElement>) {
		animationSet(args, AnimationState.SwapDone);
	},
	Moving(...args: Array<ListElement>) {
		animationSet(args, AnimationState.Moving);
	},
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

	setAnimationDelay(d: number) {
		if(d <= 0) {
			return;
		} 
		this.delay = d;
	}

	changeElementsCount(count: number) {
		this.stop();

		let newElements = Array<ListElement>(count);
		for(let i = 0; i < count; i++) {
			newElements[i] = { value: randomInt(10, 600), state: AnimationState.None };
		}
		this.setElements(newElements);
		this.elements = newElements;
	}

	setElements(elements: Array<ListElement>) {
		this.elements = elements;
		this.generator = this.sortGenerator();
	}

	get elementsCount() {
		return this.elements.length;
	}

	shuffle() {
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

	private stop() {
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
		this.changeElementsCount(this.elementsCount);
	}
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
}
