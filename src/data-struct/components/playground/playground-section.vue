<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import { playground } from "../../handler/playground-handler";
import { createSampleLinkedList } from "../../samples";
import { EventHandler } from "../../handler/event-handler";

const props = defineProps<{
	toolIdx: { value: number },
	toolCanvas: { value: null | HTMLCanvasElement }
}>();

const playgroundSection = ref<null | HTMLElement>(null);
const pgndCanvas = ref<null | HTMLCanvasElement>(null);
const toolCanvas = ref<null | HTMLCanvasElement>(null);
const lineCanvas = ref<null | HTMLCanvasElement>(null);
const eventHandler = new EventHandler();

function resizeCanvas() {
	if(playgroundSection.value === null) throw "playgroundSection not found";
	const width = playgroundSection.value.clientWidth;
	const height = playgroundSection.value.clientHeight;
	playground.resizeCanvas(width, height);
}

onMounted(() => {
	playground.init(
		pgndCanvas.value as HTMLCanvasElement,
		toolCanvas.value as HTMLCanvasElement,
		lineCanvas.value as HTMLCanvasElement,
		props.toolIdx.value
	);
	resizeCanvas();
	window.addEventListener("resize", resizeCanvas);
	createSampleLinkedList(playground.canvas);
})

onUnmounted(() => {
	window.removeEventListener("resize", resizeCanvas);
})
</script>

<template>
<section id="playground-section" ref="playgroundSection">
	<canvas id="playground-lines" ref="lineCanvas"></canvas>
	<canvas
		id="playground"
		@pointerdown="eventHandler.pointerDown($event, playground)"
		@pointerup="eventHandler.pointerUp($event, playground)"
		@pointerenter="eventHandler.pointerEnter($event, playground)"
		@pointerleave="eventHandler.pointerLeave($event, playground)"
		@pointermove="eventHandler.pointerMove($event, playground)"
		ref="pgndCanvas"
	></canvas>
	<slot ref="toolCanvas"></slot>
</section>
</template>

<style scoped>
#playground-section{
	overflow: hidden;
	position: relative;
	width: 100%;
	height: 100vh;
}

#playground-lines{
	display: block;
	background-color: rgb(30, 30, 30);
	position: absolute;
}

#playground{
	display: block;
	background-color: transparent;
	position: relative;
	touch-action: none;
}

</style>
