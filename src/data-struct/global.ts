import { Ref, shallowRef, reactive, readonly } from "vue";
import { ElementHandler, panHandler } from "./handler/element-handler";
import { ToolLLNode } from "./linked-list/tool-node";
import { ToolGNode } from "./graph/tool-node.ts";
import { ToolUEdge } from "./graph/tool-u-edge.ts";
import { ToolDEdge } from "./graph/tool-d-edge.ts";

export const focusedElement = shallowRef<ElementHandler>(panHandler);
export let DELAY = 200;
const _errorPopup = reactive({
	text: ""
})

export const errorPopup = readonly(_errorPopup);

const _infoPopup = reactive({
	text: ""
})

export const infoPopup = readonly(_infoPopup);

export function setDelay(d: number) {
	if(d < 1) return;
	DELAY = d;
}

export function setErrorPopupText(text: string) {
	_errorPopup.text = text;
}

export function setInfoPopupText(text: string) {
	_infoPopup.text = text;
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

