<script setup lang="ts">
import { ElementGNode } from '../../graph/el-node';
import { playground } from '../../handler/playground-handler';
import { useSelectedElement, unselectElement } from '../../global';
import { GraphAlgorithms } from "../../graph/algorithms/graph-algorithm";
import Select from "../../../common-components/select.vue";
import { ref } from 'vue';

const selectedElement = useSelectedElement<ElementGNode>();

const currentAlg = ref("");

function setNodeValue(value: string) {
	selectedElement.value.value = value;
	selectedElement.value.draw(playground.canvas.ctx);
}

async function deleteNode() {
	const el = selectedElement.value;
	unselectElement();
	await el.deleteNode(playground.canvas);
	playground.canvas.redraw();
}

function onChange(value: GraphAlgorithms) {
	console.log(value);
}

</script>

<template>
<div class="tool-node">
	<h1>Node</h1>
	<div class="sub-sections-container">
		<div>
			<input
				placeholder="value"
				type="text"
				spellcheck="false"
				:value="selectedElement.value"
				@input="setNodeValue(($event.target as any).value)"
			/>
		</div>

		<div class="buttons">
			<button class="btn btn-nobg clr-red" @click="deleteNode()">delete</button>
		</div>

		<div>
			<div class="custom-select-container algorithms">
				<Select
					:options="GraphAlgorithms"
					:onChange="(value) => onChange(value as GraphAlgorithms)"
					:value="currentAlg"
				/>
			</div>

		</div>
	</div>
</div>
</template>

<style scoped>
@import "../css/common.css";

.tool-node {
	color: white;
}

.sub-sections-container > div{
	--bg: rgb(64, 55, 48);
}

.algorithms {
	width: 100%;
}

.algorithms select {
	width: 100%;
}

.tool-node > h1{
	margin-bottom: 1rem;
	font-size: 1.75rem;
}

.buttons{
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 0.5rem 0.5rem;
}

.buttons button{
	min-width: 4.5rem;
}

</style>
