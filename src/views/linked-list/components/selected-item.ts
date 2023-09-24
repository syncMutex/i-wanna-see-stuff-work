import { Ref, shallowRef } from "vue";
import { ElementHandler } from "./elements/element-handler";

export const selectedElement = shallowRef<ElementHandler>(new ElementHandler);

export function useSelectedElement<T>() {
	return selectedElement as Ref<T>;
}

export function unselectElement() {
	selectedElement.value = new ElementHandler;
}
