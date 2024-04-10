import { readonly, ref, shallowReactive } from "vue";
import { AlgorithmHandler } from "../algorithm-handler";

const _isMenuOpen = ref<boolean>(false);
const _showToolBar = ref<boolean>(true);
const _isMemAllocShow = ref<boolean>(false);

class AlgorithmState {
	alg: null | AlgorithmHandler = null;
	isDone: boolean = false;

	setAlgorithm(handler: AlgorithmHandler) {
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

export function setIsMenuOpen(v: boolean) {
	_isMenuOpen.value = v;
}

export function setShowToolBar(v: boolean) {
	_showToolBar.value = v;
}

export function setIsMemAllocShow(v: boolean) {
	_isMemAllocShow.value = v;
}

export const showToolBar = readonly(_showToolBar);
export const isMenuOpen = readonly(_isMenuOpen);
export const isMemAllocShow = readonly(_isMemAllocShow);

