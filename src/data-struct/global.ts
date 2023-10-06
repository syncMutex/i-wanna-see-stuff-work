import { Ref, shallowRef, reactive, readonly } from "vue";
import { ElementHandler, Empty } from "./handler/element-handler";
import { ToolNode } from "./linked-list/tool-node";

export const selectedElement = shallowRef<ElementHandler>(new Empty);
const _popup = reactive({
	text: ""
})

export const popup = readonly(_popup);

export function setPopupText(text: string) {
	_popup.text = text;
}

export function useSelectedElement<T>() {
	return selectedElement as Ref<T>;
}

export function unselectElement() {
	selectedElement.value = new Empty;
}

export const disablePointerEvents = shallowRef(false);


export interface ToolType {
	name: string,
	toolClass: any
}

export const ToolList: ToolType[] = [
	{ name: "Node", toolClass: ToolNode },
];

