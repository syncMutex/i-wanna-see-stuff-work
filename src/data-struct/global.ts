import { Ref, shallowRef } from "vue";
import { ElementHandler, Empty } from "./handler/element-handler";
import { ToolNode } from "./linked-list/tool-node";

export const selectedElement = shallowRef<ElementHandler>(new Empty);

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

