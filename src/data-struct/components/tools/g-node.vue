<script setup lang="ts">
import { ElementGNode } from '../../graph/el-node';
import { playground } from '../../handler/playground-handler';
import { useSelectedElement, unselectElement } from '../../global';

const selectedElement = useSelectedElement<ElementGNode>();

function setNodeValue(value: string) {
	selectedElement.value.value = value;
	selectedElement.value.draw(playground.canvas.playgroundCanvas);
}

function deleteNode() {
	unselectElement();
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

</style>
