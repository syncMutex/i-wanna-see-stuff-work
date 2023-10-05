<script lang="ts" setup>
import ToolBarSection from "./tool-bar.vue";
import PlaygroundSection from "./playground/playground-section.vue";
import SelectedItem from "./selected-item.vue";
// import SettingsMenu from "./settings-menu.vue";
import { reactive, ref, onMounted } from "vue";

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
	<!--
	<SettingsMenu />
	-->

	<ToolBarSection :setTool="setTool"/>

	<PlaygroundSection :toolIdx="toolIdx" :toolCanvas="toolCanvas">
		<canvas id="element" ref="toolCanvasRef"></canvas>
	</PlaygroundSection>

	<SelectedItem />
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

</style>
