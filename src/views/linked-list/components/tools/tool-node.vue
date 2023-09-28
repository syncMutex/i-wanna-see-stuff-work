<script setup lang="ts">
import { ref } from 'vue';
import { ElementNode } from '../elements/el-node';
import { playground } from '../playground/playground-handler';
import { useSelectedElement, unselectElement } from '../selected-item';

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

function setDelay(val: number) {
	ElementNode.setDelay(val);
}

</script>

<template>
<div class="tool-node">
	<h1>Node</h1>
	<div>
		<input type="text" :value="selectedElement.value" @input="setNodeValue(($event.target as any).value)">
		<div>
			<button @click="deleteNode()">delete</button>
			<button @click="deleteAll()">delete all</button>
			<button @click="next()">next</button>
		</div>

		<div class="control-partition">
			<span>speed</span>
			<div class="speed">
				<input class="speed-inp"
					type="range"
					min="1"
					max="100" 
					@input="(e: any) => setDelay(+e.target.value)" 
				/>
			</div>
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

.control-partition{
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin-left: 1rem;
	height: 100%;
	width: max-content;
	padding-top: 1.5rem;
}

*{
	--control-bg: rgb(26, 0, 61);
	--purple: rgb(112, 0, 255);
	--aqua: rgb(3, 252, 161);
	--pink: rgb(255, 0, 64);
	--element-height: 1.5rem;
}

.speed{
	display: flex;
	justify-content: center;
	align-items: center;
}

.speed-inp{
	--track-height: 0.2rem;
	--thumb-width: 1rem;
	--thumb-height: 0.5rem;
	direction: rtl;	
	-webkit-appearance: none;
	appearance: none;
	cursor: pointer;
	background: transparent;
}

.speed-inp:hover{
	--thumb-width: 1rem;
	--thumb-height: 1rem;
}

.speed-inp::-webkit-slider-runnable-track{
	--bg: var(--aqua);
	background: var(--bg);
	height: var(--track-height);
	border-radius: 1rem;
	transition: all 0.3s;
}

.speed-inp:hover::-webkit-slider-runnable-track{
	--track-height: 0.4rem;
	box-shadow: 0 0 5px var(--bg);
}

.speed-inp::-webkit-slider-thumb{
	--bg: white;
	-webkit-appearance: none;
	appearance: none;
	width: var(--thumb-width);
	height: var(--thumb-height);
	background: white;
	box-shadow: 0 0 1px var(--bg);
	border-radius: 1rem;
	margin-top: calc(var(--thumb-height) / 2 * -1 + var(--track-height) / 2);
	transition: all 0.3s;
}

.speed-inp:hover::-webkit-slider-thumb{
	box-shadow: 0 0 8px var(--bg);
}
</style>
