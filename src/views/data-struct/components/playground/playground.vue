<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { CanvasSize, setCanvasSize } from "../../canvas";
import { playground } from "../../playground-handler";
import { EventHandler } from "../../event-handler";
import { createSampleLinkedList } from "../../common-utils";

const props = defineProps<{
	GAP: number,
	toolIdx: { value: number },
	toolCanvas: { value: null | HTMLCanvasElement },
	canvasSize: CanvasSize,
}>();

const playgroundCanvas = ref<null | HTMLCanvasElement>(null);
const eventHandler = new EventHandler();

watch(props.toolCanvas, c => {
	playground.canvas.toolCanvas = c.value as HTMLCanvasElement;
})

watch(props.toolIdx, idx => {
	playground.setTool(idx.value);
})

watch(props.canvasSize, size => {
	resizePlayground(size);
	playground.canvas.redraw();
})

function resizePlayground({ width, height }: CanvasSize) {
	if(playgroundCanvas.value === null) return;
	setCanvasSize(playgroundCanvas.value, width, height);
}

onMounted(() => {
	playground.canvas.playgroundCanvas = playgroundCanvas.value as HTMLCanvasElement;
	playground.canvas.toolCanvas = props.toolCanvas.value as HTMLCanvasElement;
	playground.setTool(props.toolIdx.value);
	createSampleLinkedList(playground.canvas);
})

</script>

<template>
	<canvas
		id="playground"
		@pointerdown="eventHandler.pointerDown($event, playground)"
		@pointerup="eventHandler.pointerUp($event, playground)"
		@pointerenter="eventHandler.pointerEnter($event, playground)"
		@pointerleave="eventHandler.pointerLeave($event, playground)"
		@pointermove="eventHandler.pointerMove($event, playground)"
		ref="playgroundCanvas"
	></canvas>
</template>

<style scoped>
#playground{
	display: block;
	background-color: transparent;
	position: relative;
	touch-action: none;
}

</style>
