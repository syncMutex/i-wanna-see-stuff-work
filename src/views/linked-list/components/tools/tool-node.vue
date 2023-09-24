<script setup lang="ts">
import { ElementNode } from '../elements/node';
import { playground } from '../playground/playground-handler';
import { useSelectedElement } from '../selected-item';

const selectedElement = useSelectedElement<ElementNode>();

function setNodeValue(value: string) {
	selectedElement.value.el.value = value;
	selectedElement.value.draw(playground.canvas.playgroundCanvas);
}

</script>

<template>
<div class="tool-node">
	<h1>Node</h1>
	<div>
		<input type="text" :value="selectedElement.el.value" @input="setNodeValue(($event.target as any).value)">
	</div>
</div>
</template>

<style scoped>
.tool-node {
	background: red;
}
</style>
