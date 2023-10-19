import { Ref, shallowRef, reactive, readonly } from "vue";
import { ElementHandler, panHandler } from "./handler/element-handler";
import { ToolLLNode } from "./linked-list/tool-node";
import { ToolGNode } from "./graph/tool-node.ts";
import { ToolUEdge } from "./graph/tool-u-edge.ts";

export const selectedElement = shallowRef<ElementHandler>(panHandler);
export let delay = 500;
const _popup = reactive({
	text: ""
})

export const popup = readonly(_popup);

export function setDelay(d: number) {
	if(d < 1) return;
	delay = d;
}

export function setPopupText(text: string) {
	_popup.text = text;
}

export function useSelectedElement<T>() {
	return selectedElement as Ref<T>;
}

export function unselectElement() {
	selectedElement.value = panHandler;
}

export const disablePointerEvents = shallowRef(false);


export interface ToolType {
	name: string,
	toolClass: any
}

export const ToolList: ToolType[] = [
	{ name: "LLNode", toolClass: ToolLLNode },
	{ name: "Graph Node", toolClass: ToolGNode },
	{ name: "UEdge", toolClass: ToolUEdge },
];

