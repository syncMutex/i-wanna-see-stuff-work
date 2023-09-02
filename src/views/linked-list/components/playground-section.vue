<script lang="ts" setup>
import { ref, onMounted, reactive, onBeforeUpdate, onUnmounted } from "vue";

const playgroundSection = ref<null | HTMLElement>(null);
const canvasLinesElement = ref<null | HTMLCanvasElement>(null);
const canvasPlayground = ref<null | HTMLCanvasElement>(null);
const element = ref<null | HTMLCanvasElement>(null);
const canvasSize = reactive({ width: 0, height: 0 });
const GAP = 10;

function drawLines() {
	if(canvasLinesElement.value === null) return;
	const ctx = canvasLinesElement.value.getContext("2d");
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

function setCanvasSize(canvas: HTMLCanvasElement) {
	if(playgroundSection.value === null) return;
	canvasSize.height = playgroundSection.value.clientHeight;
	canvasSize.width = playgroundSection.value.clientWidth;
	const ratio = Math.ceil(window.devicePixelRatio);
	const { width, height } = canvasSize;
	if(canvas === null) return;
	canvas.width = width * ratio;
	canvas.height = height * ratio;
	canvas.style.width = `${width}px`;
	canvas.style.height = `${height}px`;
	canvas.getContext('2d')?.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function resizeCanvas() {
	if(canvasLinesElement.value === null || canvasPlayground.value === null) return;
	setCanvasSize(canvasLinesElement.value);
	setCanvasSize(canvasPlayground.value);
	drawLines();
}

function pointerMove(e: PointerEvent) {
	if(e.target === null) return;
	if(element.value === null) return;

	const rect = (e.target as any).getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;
	const ctx = element.value.getContext("2d");
	if(ctx === null) return;

	const width = GAP * 10;
	const height = GAP * 10;

	element.value.width = width;
	element.value.height = height;
	element.value.style.width = `${width}px`;
	element.value.style.height = `${height}px`;

	const posX = Math.floor(x / GAP) * GAP - (element.value.clientWidth / 2);
	const posY = Math.floor(y / GAP) * GAP - (element.value.clientHeight / 2);

	ctx.fillStyle = "#FFFF00";
	ctx.fillRect(0, 0, width, height);

	element.value.style.top = posY + "px";
	element.value.style.left = posX + "px";
}

function clickEvent(e: MouseEvent) {
	if(canvasPlayground.value === null) return;
	if(element.value === null) return;

	const rect = (e.target as any).getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;

	const ctx = canvasPlayground.value.getContext("2d");
	if(ctx === null) return;
	ctx.clearRect(0, 0, canvasPlayground.value.width, canvasPlayground.value.height);

	const width = GAP * 10;
	const height = GAP * 10;

	const posX = Math.floor(x / GAP) * GAP - (element.value.clientWidth / 2);
	const posY = Math.floor(y / GAP) * GAP - (element.value.clientHeight / 2);

	ctx.fillStyle = "#FF0000";
	ctx.fillRect(posX, posY, width, height);
}

onBeforeUpdate(() => drawLines());

onMounted(() => {
	resizeCanvas();
	window.addEventListener("resize", resizeCanvas);
})

onUnmounted(() => {
	window.removeEventListener("resize", resizeCanvas);
})

</script>

<template>
<section id="playground-section" ref="playgroundSection">
	<canvas id="playground-lines" ref="canvasLinesElement"></canvas>
	<canvas id="playground" @click="clickEvent" @pointermove="pointerMove" ref="canvasPlayground"></canvas>
	<canvas id="element" ref="element"></canvas>
</section>
</template>

<style scoped>
#playground-section{
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
