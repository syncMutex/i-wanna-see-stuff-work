<script setup lang="ts">
import { ref } from "vue";
import { ToolList } from "../common-utils";
import ToolNode from "./tool-node.vue";
import { selectedElement } from "../selected-item.ts";

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
<section id="tool-bar-section">
	<div class="tools-list">
		<div
			v-for="(tool, idx) in ToolList"
			:class="['node', idx === curToolIdx ? 'selected' : '']"
			@click="selectTool(idx)"
		>{{tool.name}}</div>
	</div>

	<div class="selected-item">
		<ToolNode v-if="selectedElement.constructor.name === 'ElementNode'" />
	</div>
</section>
</template>

<style scoped>
#tool-bar-section{
	width: 100%;
	max-width: 20rem;
	height: 100vh;
	background-color: rgb(50, 40, 50);
}

.tools-list{
	display: flex;
	flex-wrap: wrap;
}

.tools-list div{
	width: 5rem;
	height: 5rem;
	background: white;
	margin-right: 1rem;
}

.tools-list div.selected{
	background-color: red;
}

</style>
