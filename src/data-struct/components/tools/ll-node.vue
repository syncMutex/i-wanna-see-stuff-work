<script setup lang="ts">
import { ref } from 'vue';
import { ElementNode } from '../../linked-list/el-node';
import { playground } from '../../handler/playground-handler';
import { useSelectedElement, unselectElement } from '../../global';

const selectedElement = useSelectedElement<ElementNode>();
const toFindValue = ref('');

function setNodeValue(value: string) {
	selectedElement.value.value = value;
	selectedElement.value.draw(playground.canvas.playgroundCanvas);
}

function deleteNode() {
	selectedElement.value.deleteNode(playground.canvas);
	unselectElement();
}

async function next() {
	if(selectedElement.value === null) return;
	if(selectedElement.value.next === null) {
		unselectElement();
		playground.canvas.redraw();
		return;
	}
	selectedElement.value = selectedElement.value.next;
	await selectedElement.value.scrollTo(playground.canvas);
	playground.canvas.redraw();
}

function deleteAll() {
	selectedElement.value.deleteAllReachable(playground.canvas);
}

function find() {
	selectedElement.value.find(toFindValue.value, playground.canvas);
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
			<button class="btn btn-nobg clr-red" @click="deleteAll()">delete all</button>
			<button class="btn btn-nobg clr-lblue" @click="next()">next</button>
		</div>

		<div class="find">
			<h2>Find node</h2>
			<input spellcheck="false" placeholder="value" type="text" v-model="toFindValue" />
			<button class="btn btn-nobg" @click="find()">find</button>
		</div>
	</div>
</div>
</template>

<style scoped>
@import "../css/common.css";

.tool-node {
	color: white;
}

.tool-node > h1{
	margin-bottom: 1rem;
	font-size: 1.75rem;
}

.sub-sections-container > div{
	margin-bottom: 1rem;
	padding: 0.5rem 0.4rem;
	border-radius: 4px;
	background-color: rgb(40, 40, 40);
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

.find button{
	margin-top: 0.5rem;
}

.find h2{
	font-size: 1.2rem;
	margin-bottom: 0.5rem;
}

</style>
