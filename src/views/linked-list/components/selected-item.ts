import { Ref, ref } from "vue";
import { ElementHandler } from "./elements/element-handler";

export const selectedElement = ref<ElementHandler>(new ElementHandler);

export function useSelectedElement<T>() {
	return selectedElement as Ref<T>;
}
