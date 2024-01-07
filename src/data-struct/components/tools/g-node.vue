<script setup lang="ts">
import { ElementGNode } from '../../graph/el-node';
import { playground } from '../../handler/playground-handler';
import { useFocusedElement, unfocusElement } from '../../global';
import { GraphAlgorithms } from "../../graph/algorithms/graph-algorithm";
import Select from "../../../common-components/select.vue";
import { ref } from 'vue';
import { algorithmState, setShowToolBar } from '../refs';
import dfs from '../../graph/algorithms/dfs';
import bfs from '../../graph/algorithms/bfs';

const focusedElement = useFocusedElement<ElementGNode>();

const currentAlg = ref(GraphAlgorithms.Bfs);

function setNodeValue(value: string) {
	focusedElement.value.value = value;
	focusedElement.value.draw(playground.canvas.ctx);
}

async function deleteNode() {
	const el = focusedElement.value;
	unfocusElement();
	await el.deleteNode(playground.canvas);
	playground.canvas.redraw();
}

function onChange(value: GraphAlgorithms) {
	currentAlg.value = value;
}

function run() {
	let alg;
	switch(currentAlg.value) {
		case GraphAlgorithms.Dfs:
			dfs.init(focusedElement.value);
			alg = dfs;
			break;
		case GraphAlgorithms.Bfs:
			bfs.init(focusedElement.value);
			alg = bfs;
			break;
	}

	algorithmState.initAlgorithm(alg);
	alg.play(playground.canvas);

	unfocusElement();
	playground.canvas.redraw();
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
				:value="focusedElement.value"
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
			<div style="margin-top: 1rem">
				<button class="btn btn-nobg" @click="run()">run</button>
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
