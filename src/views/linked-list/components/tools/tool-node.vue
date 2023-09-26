<script setup lang="ts">
import { ref } from 'vue';
import { ElementNode } from '../elements/node';
import { playground } from '../playground/playground-handler';
import { useSelectedElement, unselectElement } from '../selected-item';

const selectedElement = useSelectedElement<ElementNode>();
const toFindValue = ref('');

function setNodeValue(value: string) {
	selectedElement.value.el.value = value;
	selectedElement.value.draw(playground.canvas.playgroundCanvas);
}

function deleteNode() {
	selectedElement.value.deleteNode(playground.canvas);
	unselectElement();
}

function next() {
	if(selectedElement.value === null) return;
	if(selectedElement.value.next === null) {
		unselectElement();
		playground.canvas.redraw();
		return;
	}
	selectedElement.value = selectedElement.value.next;
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
	<div>
		<input type="text" :value="selectedElement.el.value" @input="setNodeValue(($event.target as any).value)">
		<div>
			<button @click="deleteNode()">delete</button>
			<button @click="deleteAll()">delete all</button>
			<button @click="next()">next</button>
		</div>
		<div>
			<h2>find</h2>
			<input type="text" v-model="toFindValue" />
			<button @click="find()">find</button>
		</div>
	</div>
</div>
</template>

<style scoped>
.tool-node {
	color: white;
}
</style>
