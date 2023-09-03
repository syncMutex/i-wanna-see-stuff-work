<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import PlaygroundLines from "./playground-lines.vue";
import Playground from "./playground.vue";
import { CanvasSize, GAP } from "./canvas";
import { Tool } from "./tools/tool.ts";

const props = defineProps<{
	tool: null | Tool,
	toolCanvas: null | HTMLCanvasElement
	moveTool: (x:number, y: number) => void,
	hideTool: () => void
	showTool: () => void
}>();
const playgroundSection = ref<null | HTMLElement>(null);
const canvasSize = ref<CanvasSize>({
	width: -1,
	height: -1
});

function resizeCanvas() {
	if(playgroundSection.value === null) throw "playgroundSection not found";
	canvasSize.value.width = playgroundSection.value.clientWidth;
	canvasSize.value.height = playgroundSection.value.clientHeight;
}

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
	<PlaygroundLines :canvas-size="canvasSize" :GAP="GAP" />
	<Playground
		:GAP="GAP"
		:canvasSize="canvasSize"
		:tool="props.tool"
		:moveTool="props.moveTool"
		:hideTool="props.hideTool"
		:showTool="props.showTool"
	/>
	<slot></slot>
</section>
</template>

<style scoped>
#playground-section{
	overflow: hidden;
	position: relative;
	width: 100%;
	height: 100vh;
}

</style>
