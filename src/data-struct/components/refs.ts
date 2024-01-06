import { readonly, ref, shallowReactive } from "vue";
import { AlgorithmHandler } from "../algorithm-handler";

const isMenuOpen = ref<boolean>(false);

function setIsMenuOpen(v: boolean) {
	isMenuOpen.value = v;
}

export default {
	isMenuOpen: readonly(isMenuOpen),
	setIsMenuOpen
}

type AlgorithmState = {
	alg: null | AlgorithmHandler,
	isDone: boolean,
};

export const algorithmState = shallowReactive<AlgorithmState>({
	alg: null,
	isDone: false
});

