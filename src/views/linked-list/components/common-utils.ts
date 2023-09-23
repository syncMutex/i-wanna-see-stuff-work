import { ToolNode } from "./tools/tool-handler";


export interface ToolType {
	name: string,
	toolClass: any
}

export const ToolList: ToolType[] = [
	{ name: "Node", toolClass: ToolNode },
]

export function randInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min) + min);
}

