<script lang="ts" setup>
import ToolBarSection from "./tools/tool-bar-section.vue";
import PlaygroundSection from "./playground/playground-section.vue";
import { reactive, ref, onMounted } from "vue";
import { selectedElement } from "../selected-item";
import ToolNode from "./tools/tool-node.vue";

const toolIdx = reactive<{value: number}>({ value: -1 });
const toolCanvasRef = ref<null | HTMLCanvasElement>(null);
const toolCanvas = reactive<{ value: null | HTMLCanvasElement }>({ value: null });

function setTool(idx: number) {
	toolIdx.value = idx;
}

onMounted(() => {
	toolCanvas.value = toolCanvasRef.value;
})
</script>

<template>
<div class="linked-list-body">
	<ToolBarSection :setTool="setTool"/>

	<PlaygroundSection
		:toolIdx="toolIdx"
		:toolCanvas="toolCanvas"
	>
		<canvas id="element" ref="toolCanvasRef"></canvas>
	</PlaygroundSection>

	<div class="selected-item" v-if="selectedElement.constructor.name === 'ElementNode'">
		<ToolNode />
	</div>
</div>
</template>

<style scoped>
.linked-list-body{
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: row;
	position: relative;
	align-items: center;
	justify-content: center;
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

.selected-item{
	position: absolute;
	left: 1%;
	top: 15%;
	z-index: 10;
	width: 12rem;
	height: 30rem;
	background-color: rgb(50, 50, 50);
	box-shadow: 0 5px 20px rgb(0, 0, 0);
	border: 2px solid white;
	border-radius: 6px;
}

</style>
