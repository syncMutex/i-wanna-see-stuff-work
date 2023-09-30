<script setup lang="ts">
import { ref } from "vue";
import { ToolList } from "../common-utils";

const props = defineProps<{
	setTool: (t: number) => void;
}>();
const curToolIdx = ref<number>(-1);

function selectTool(idx: number) {
	if(idx === curToolIdx.value) {
		curToolIdx.value = -1;
	} else {
		curToolIdx.value = idx;
	}
	props.setTool(curToolIdx.value);
}

</script>

<template>
<section id="tool-bar-section" class="floating-panel">
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
	top: 2%;
	left: 50%;
	transform: translateX(-50%);
	width: 100%;
	height: 2.5rem;
	max-width: 20rem;
	padding: 0.3rem;
	z-index: 10;
}

.tools-list{
	display: flex;
	flex-wrap: wrap;
	width: 100%;
	height: 100%;
}

.tools-list div{
	height: 100%;
	background: white;
	color: black;
	margin-right: 1rem;
}

.tools-list div.selected{
	background-color: red;
}

</style>
