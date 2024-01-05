import { readonly, ref, shallowRef, ShallowRef } from "vue";
import { AlgorithmHandler } from "../algorithm-handler";

const isMenuOpen = ref<boolean>(false);

function setIsMenuOpen(v: boolean) {
	isMenuOpen.value = v;
}

export default {
	isMenuOpen: readonly(isMenuOpen),
	setIsMenuOpen
}

export const curAlgorithm: ShallowRef<AlgorithmHandler | null> = shallowRef(null);


