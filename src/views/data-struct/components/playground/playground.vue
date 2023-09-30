<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { playground } from "../../playground-handler";
import { EventHandler } from "../../event-handler";

const props = defineProps<{
	GAP: number,
	toolIdx: { value: number },
	toolCanvas: { value: null | HTMLCanvasElement },
}>();

const playgroundCanvas = ref<null | HTMLCanvasElement>(null);
const eventHandler = new EventHandler();

watch(props.toolCanvas, c => {
	playground.canvas.toolCanvas = c.value as HTMLCanvasElement;
})

watch(props.toolIdx, idx => {
	playground.setTool(idx.value);
})

onMounted(() => {
	playground.init(
		playgroundCanvas.value as HTMLCanvasElement,
		props.toolCanvas.value as HTMLCanvasElement,
		props.toolIdx.value
	);
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
