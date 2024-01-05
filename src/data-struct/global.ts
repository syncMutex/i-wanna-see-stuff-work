import { Ref, shallowRef, reactive, readonly } from "vue";
import { ElementHandler, panHandler } from "./handler/element-handler";
import { ToolLLNode } from "./linked-list/tool-node";
import { ToolGNode } from "./graph/tool-node.ts";
import { ToolUEdge } from "./graph/tool-u-edge.ts";
import { ToolDEdge } from "./graph/tool-d-edge.ts";

export const focusedElement = shallowRef<ElementHandler>(panHandler);
export let DELAY = 500;
const _popup = reactive({
	text: ""
})

export const popup = readonly(_popup);

export function setDelay(d: number) {
	if(d < 1) return;
	DELAY = d;
}

export function setPopupText(text: string) {
	_popup.text = text;
}

export function useFocusedElement<T>() {
	return focusedElement as Ref<T>;
}

export function focusElement(el: ElementHandler) {
	if(focusedElement.value !== panHandler) {
		focusedElement.value.unfocus();
	}
	focusedElement.value = el;
	el.focus();
}

export function unfocusElement() {
	if(focusedElement.value) {
		focusedElement.value.unfocus();
	}

	focusedElement.value = panHandler;
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
	{ name: "DEdge", toolClass: ToolDEdge },
];

