import { readonly, ref, shallowReactive } from "vue";
import { AlgorithmHandler } from "../algorithm-handler";
// import bfs from "../graph/algorithms/bfs";

const isMenuOpen = ref<boolean>(false);
const _showToolBar = ref<boolean>(true);

class AlgorithmState {
	alg: null | AlgorithmHandler = null;
	isDone: boolean = false;

	initAlgorithm(handler: AlgorithmHandler) {
		this.alg = handler;
		this.isDone = false;
		setShowToolBar(false);
	}

	forceStopAlgorithm() {
		this.alg = null;
		this.isDone = true;
		setShowToolBar(true);
	}

	algorithmDone() {
		this.isDone = true;
		setShowToolBar(true);
	}
};

export const algorithmState = shallowReactive<AlgorithmState>(new AlgorithmState);

function setIsMenuOpen(v: boolean) {
	isMenuOpen.value = v;
}

export function setShowToolBar(v: boolean) {
	_showToolBar.value = v;
}

export const showToolBar = readonly(_showToolBar);

export default {
	isMenuOpen: readonly(isMenuOpen),
	setIsMenuOpen,
}

