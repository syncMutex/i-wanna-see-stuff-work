<script setup lang="ts">
import { ref } from "vue";
import { disablePointerEvents, ToolList } from "../global";
import { playground } from "../handler/playground-handler";
import { showToolBar } from "./refs";

const curToolIdx = ref<number>(-1);

function selectTool(idx: number) {
	if(idx === curToolIdx.value) {
		curToolIdx.value = -1;
	} else {
		curToolIdx.value = idx;
	}
	playground.setTool(curToolIdx.value);
}

</script>

<template>
<section
	v-if="showToolBar"
	id="tool-bar-section"
	:class="['floating-panel', disablePointerEvents ? 'pointer-events-none' : '']"
>
	<div class="tools-list">
		<div
			v-for="(tool, idx) in ToolList"
			:class="['node', idx === curToolIdx ? 'selected' : '']"
			@click="selectTool(idx)"
		>{{tool.name}}</div>
	</div>
</section>
</template>

<style scoped>
@import "./css/common.css";

#tool-bar-section{
	position: absolute;
	width: 100%;
	height: 2.5rem;
	max-width: 50%;
	min-width: 2rem;
	padding: 0.3rem;
	top: 0.5rem;
	left: 50%;
	transform: translateX(-50%);
	z-index: 10;
	overflow-x: auto;
	overflow-y: hidden;
}

.tools-list{
	display: flex;
	width: 100%;
	height: 100%;
}

.tools-list div{
	height: 100%;
	background: white;
	color: black;
	margin-right: 1rem;
	cursor: pointer;
	min-width: max-content;
}

.tools-list div.selected{
	background-color: red;
}

</style>
