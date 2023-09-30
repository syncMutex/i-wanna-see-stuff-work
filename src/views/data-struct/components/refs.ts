import { readonly, ref } from "vue";

const isMenuOpen = ref<boolean>(false);

function setIsMenuOpen(v: boolean) {
	isMenuOpen.value = v;
}

export default {
	isMenuOpen: readonly(isMenuOpen),
	setIsMenuOpen
}
