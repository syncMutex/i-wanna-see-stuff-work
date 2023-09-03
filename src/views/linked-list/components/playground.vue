<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { CanvasSize, setCanvasSize, ElementGroup, GAP } from "./canvas";
import { Tool } from "./tools/tool.ts";

const props = defineProps<{
	GAP: number,
	tool: Tool | null,
	canvasSize: CanvasSize,
	moveTool: (x:number, y:number) => void,
	hideTool: () => void,
	showTool: () => void
}>();

const playground = ref<null | HTMLCanvasElement>(null);
const elements = new ElementGroup();

watch(props.canvasSize, size => {
	resizePlayground(size);
})

function resizePlayground({ width, height }: CanvasSize) {
	if(playground.value === null) return;
	setCanvasSize(playground.value, width, height);
}

function pointerMove(e: PointerEvent) {
	if(playground.value === null || props.tool === null) return;
	if(e.target === null) return;

	const rect = (e.target as any).getBoundingClientRect();
	const mouseXRel = e.clientX - rect.left;
	const mouseYRel = e.clientY - rect.top;

	const x = Math.floor(mouseXRel / GAP) * GAP - (props.tool.width / 2);
	const y = Math.floor(mouseYRel / GAP) * GAP - (props.tool.height / 2);

	props.tool.setXY(x, y);
	props.moveTool(x, y);
}

function leaveEvent() {
	props.hideTool();
}

function enterEvent() {
	props.showTool();
}

function clickEvent(_e: MouseEvent) {
	if(playground.value === null || props.tool === null) return;
	elements.add(props.tool);
}

onMounted(() => {
	elements.canvas = playground.value;
})

</script>

<template>
	<canvas
		id="playground"
		@pointerenter="enterEvent"
		@pointerleave="leaveEvent"
		@click="clickEvent"
		@pointermove="pointerMove"
		ref="playground"
	></canvas>
</template>

<style scoped>
#playground{
	display: block;
	background-color: transparent;
	position: relative;
}

</style>
