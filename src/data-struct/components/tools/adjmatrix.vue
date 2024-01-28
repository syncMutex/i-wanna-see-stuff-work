<script setup lang="ts">
import { playground } from '../../handler/playground-handler';
import { unfocusElement, useFocusedElement } from '../../global';
import Select from "../../../common-components/select.vue";
import { ref } from 'vue';
import astar, { Heuristics } from '../../graph/algorithms/astar';
import { ElementAdjMatrix } from '../../graph/el-adjmatrix';

enum GraphAlgorithms {
	Dfs = "Dfs",
	Bfs = "Bfs",
	Dijkstra = "Dijkstra",
	Astar = "A*",
}

const focusedElement = useFocusedElement<ElementAdjMatrix>();

const currentAlg = ref(GraphAlgorithms.Dijkstra);

const curHeuristics = ref(astar.curHeuristics);

const rows = ref(focusedElement.value.rows);
const columns = ref(focusedElement.value.columns);

function onChange(value: GraphAlgorithms) {
	currentAlg.value = value;
}

function onChangeHeuristics(value: Heuristics) {
	curHeuristics.value = value;
}

function setRows() {
	if(rows.value < 2) {
		rows.value = 2;
	}

	focusedElement.value.setRows(rows.value);
	playground.canvas.redraw();
}

function setColumns() {
	if(columns.value < 2) {
		columns.value = 2;
	}

	focusedElement.value.setColumns(columns.value);
	playground.canvas.redraw();
}

function run() {
	switch(currentAlg.value) {
		case GraphAlgorithms.Dfs:
			break;
		case GraphAlgorithms.Bfs:
			break;
		case GraphAlgorithms.Dijkstra:
			break;
		case GraphAlgorithms.Astar:
			break;
	}

	unfocusElement();
	playground.canvas.redraw();
}

function deleteMatrix() {
	const el = focusedElement.value;
	unfocusElement();
	playground.canvas.removeElements(el);
	playground.canvas.redraw();
}

</script>

<template>
<div class="tool-matrix-graph">
	<h1>Matrix Graph</h1>
	<div class="sub-sections-container">
		<div class="dims">
			<input
				placeholder="rows"
				type="number"
				v-model="rows"
				@input="setRows()"
			/>
			<span>x</span>
			<input
				placeholder="cols"
				type="number"
				v-model="columns"
				@input="setColumns()"
			/>
		</div>

		<div class="buttons">
			<button class="btn btn-nobg clr-red" @click="deleteMatrix()">delete</button>
		</div>

		<div>
			<div class="custom-select-container algorithms">
				<Select
					:options="GraphAlgorithms"
					:onChange="(value) => onChange(value as GraphAlgorithms)"
					:value="currentAlg"
				/>
			</div>

			<br>

			<div v-if="currentAlg === GraphAlgorithms.Astar" class="custom-select-container algorithms">
				<Select
					:options="Heuristics"
					:onChange="(value) => onChangeHeuristics(value as Heuristics)"
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

.tool-matrix-graph {
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

.tool-matrix-graph > h1{
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

.dims{
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-around;
}

.dims span{
	font-family: monospace;
	font-size: 1.2rem;
}

.dims input[type="number"]{
	min-width: auto;
	max-width: 4rem;
}

</style>
