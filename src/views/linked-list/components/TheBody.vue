<script lang="ts" setup>
import ToolBarSection from "./tools/tool-bar-section.vue";
import PlaygroundSection from "./playground-section.vue";
import { ref } from "vue";
import { ToolList } from "./common-utils";
import { Tool } from "./tools/tool.ts";

const tool = ref<Tool | null>(null);
const toolCanvas = ref<null | HTMLCanvasElement>(null);

function resetCanvas() {
	toolCanvas.value?.getContext("2d")?.clearRect(0, 0, toolCanvas.value.width, toolCanvas.value.height);
}

function moveTool(x: number, y: number) {
	if(toolCanvas.value === null) return;
	toolCanvas.value.style.top = y + "px";
	toolCanvas.value.style.left = x + "px";
}

function hideTool() {
	if(toolCanvas.value === null) return;
	const ctx = toolCanvas.value.getContext("2d");
	ctx?.clearRect(0, 0, toolCanvas.value.width, toolCanvas.value.height);
}

function showTool() {
	if(toolCanvas.value === null) return;
	tool.value?.toCursorCanvas(toolCanvas.value);
}

function setTool(idx: number) {
	if(idx < 0) {
		resetCanvas();
		tool.value = null;
		return;
	}
	tool.value = new ToolList[idx].toolClass();
}

</script>

<template>
<div class="linked-list-body">
	<ToolBarSection :setTool="setTool"/>
	<PlaygroundSection
		:toolCanvas="toolCanvas"
		:tool="tool"
		:moveTool="moveTool"
		:hideTool="hideTool"
		:showTool="showTool"
	>
		<canvas id="element" ref="toolCanvas"></canvas>
	</PlaygroundSection>
</div>
</template>

<style scoped>
.linked-list-body{
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: row;
	position: relative;
}

#element{
	display: block;
	background-color: transparent;
	position: absolute;
	top: 0;
	z-index: 10;
	pointer-events: none;
}

</style>
