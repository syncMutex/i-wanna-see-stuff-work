<script setup lang="ts">
import { ref, watch } from "vue";
import { setCanvasSize, CanvasSize } from "../canvas";

const { GAP, canvasSize } = defineProps<{
	GAP: number,
	canvasSize: CanvasSize
}>();
const playgroundLines = ref<null | HTMLCanvasElement>(null);

watch(canvasSize, size => {
	resizePlaygroundLines(size);
})

function resizePlaygroundLines({ width, height }: CanvasSize) {
	if(playgroundLines.value === null) return;
	setCanvasSize(playgroundLines.value, width, height);
	drawLines();
}

function drawLines() {
	if(playgroundLines.value === null) return;
	const ctx = playgroundLines.value.getContext("2d");
	if(ctx === null) return;

	ctx.strokeStyle = "#505050";

	for(let x = GAP; x < canvasSize.width; x += GAP) {
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, canvasSize.height);
		ctx.stroke();
	}

	for(let y = GAP; y < canvasSize.height; y += GAP) {
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(canvasSize.width, y);
		ctx.stroke();
	}
}

</script>

<template>
	<canvas id="playground-lines" ref="playgroundLines"></canvas>
</template>

<style scoped>
#playground-lines{
	display: block;
	background-color: rgb(30, 30, 30);
	position: absolute;
}

</style>
