<script setup lang="ts">
import { ElementUEdge } from '../../graph/el-u-edge';
import { playground } from '../../handler/playground-handler';
import { useFocusedElement, unfocusElement } from '../../global';

const focusedElement = useFocusedElement<ElementUEdge>();

function setNodeValue(value: string) {
	focusedElement.value.weight = Number(value);
	playground.canvas.redraw();
}

async function deleteEdge() {
	const el = focusedElement.value;
	unfocusElement();
	await el.delete(playground.canvas);
	playground.canvas.redraw();
}

</script>

<template>
<div class="tool-edge">
	<h1>UEdge</h1>
	<div class="sub-sections-container">
		<div>
			<input
				placeholder="value"
				type="number"
				spellcheck="false"
				:value="focusedElement.weight"
				@input="setNodeValue(($event.target as any).value)"
			/>
		</div>

		<div class="buttons">
			<button class="btn btn-nobg clr-red" @click="deleteEdge()">delete</button>
		</div>
	</div>
</div>
</template>

<style scoped>
@import "../css/common.css";

.tool-edge {
	color: white;
}

.tool-edge > h1{
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
