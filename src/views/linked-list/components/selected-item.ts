import { Ref, shallowRef } from "vue";
import { ElementHandler } from "./elements/element-handler";
import { Empty } from "./elements/element-handler.ts";

export const selectedElement = shallowRef<ElementHandler>(new Empty);

export function useSelectedElement<T>() {
	return selectedElement as Ref<T>;
}

export function unselectElement() {
	selectedElement.value = new Empty;
}
