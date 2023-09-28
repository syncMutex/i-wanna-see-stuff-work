import { Ref, shallowRef } from "vue";
import { ElementHandler, Empty } from "./element-handler";

export const selectedElement = shallowRef<ElementHandler>(new Empty);

export function useSelectedElement<T>() {
	return selectedElement as Ref<T>;
}

export function unselectElement() {
	selectedElement.value = new Empty;
}
