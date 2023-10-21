<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import { playground } from "../handler/playground-handler";
import { createSampleGraph } from "../samples";
import { EventHandler } from "../handler/event-handler";
import { popup, setPopupText } from "../global";

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
		lineCanvas.value as HTMLCanvasElement
	);
	resizeCanvas();
	window.addEventListener("resize", resizeCanvas);
	// createSampleLinkedList(playground.canvas);
	createSampleGraph(playground.canvas);
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
	<canvas id="element" ref="toolCanvas"></canvas>
	<div v-if="popup.text !== ''" id="popup-container" @click.self="setPopupText('')">
		<div>
			<div>
				{{popup.text}}
			</div>
			<button class="btn btn-nobg" @click="setPopupText('')">ok</button>
		</div>
	</div>
</section>
</template>

<style scoped>
@import "./css/common.css";

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

#element{
	display: block;
	background-color: transparent;
	position: absolute;
	width: 0;
	height: 0;
	top: 0;
	z-index: 10;
	pointer-events: none;
	opacity: 0.5;
}

#popup-container{
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.6);
	position: absolute;
	top: 0;
	left: 0;
	z-index: 20;
}

#popup-container > div{
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	min-width: 15rem;
	min-height: 8rem;
	background-color: rgb(20, 20, 20);
	color: black;
	border-radius: 4px;
	font-size: 1.2rem;
	color: rgb(255, 57, 43);
	border: 2px solid rgb(255, 57, 43);
	box-shadow: 0 8px 30px rgb(0, 0, 0);
	padding: 1rem;
}

#popup-container button{
	margin-top: 1.5rem;
}

</style>
