import { ToolNode } from "./tools/tool-handler";


export interface ToolType {
	name: string,
	toolClass: any
}

export const ToolList: ToolType[] = [
	{ name: "Node", toolClass: ToolNode },
	// { name: "Arrow", toolClass: Arrow },
]
