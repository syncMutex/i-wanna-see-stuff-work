import { Node, Arrow } from "./tools/tool.ts";


export interface ToolType {
	name: string,
	toolClass: any
}

export const ToolList: ToolType[] = [
	{ name: "Node", toolClass: Node },
	{ name: "Arrow", toolClass: Arrow },
]
