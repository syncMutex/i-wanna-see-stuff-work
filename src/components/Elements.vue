<script setup lang="ts">
import { ref, computed } from "vue";
import { ListElement } from "../algorithms/sorter-iface";

const props = defineProps<{
	elements: Array<ListElement>,
}>();
const elementsDiv = ref<HTMLDivElement|null>(null);
const elementsDivHeight = computed(() => elementsDiv.value?.clientHeight || 1);
</script>

<template>
	<div class="elements" ref="elementsDiv">
		<template v-if="props.elements.length < 20">
			<div
				v-for="el in props.elements"
				:style="{height: `${(el.value / elementsDivHeight) * 100}%`}"
				:class="['element', el.state]"
			>
				{{el.value}}
			</div>
		</template>
		<template v-else>
			<div
				v-for="el in props.elements"
				:style="{height: `${(el.value / elementsDivHeight) * 100}%`}"
				:class="['element', el.state]"
			>
			</div>
		</template>
	</div>
</template>

<style scoped>
.elements {
	width: 100%;
	height: calc(100% - 5rem);
	display: flex;
	flex-direction: row;
	align-items: flex-end;
	background-color: rgb(10, 0, 20);
}

.element {
	--bg: rgb(40, 40, 40);
	background-color: var(--bg);
	color: white;
	border-bottom: none;
	min-width: 1px;
	max-width: 100%;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	margin-left: 2px;
	border-radius: 4px 4px 0 0;
	font-family: monospace;
	font-size: 1rem;
}

.traversing {
	--bg: rgb(0, 101, 252);
	background-color: var(--bg);
	box-shadow: 0 0 12px var(--bg);
	color: white;
}

.compare {
	--bg: yellow;
	background-color: var(--bg);
	box-shadow: 0 0 12px var(--bg);
	color: black;
}

.swap {
	--bg: rgb(255, 0, 51);
	background-color: var(--bg);
	box-shadow: 0 0 12px var(--bg);
	color: white;
}

.swap-done {
	--bg: rgb(0, 255, 110);
	background-color: var(--bg);
	box-shadow: 0 0 12px var(--bg);
	color: white;
}

.moving {
	--bg: rgb(106, 0, 255);
	background-color: var(--bg);
	box-shadow: 0 0 12px var(--bg);
	color: white;
}

.done{
	--bg: rgb(20, 255, 20);
	background-color: var(--bg);
	box-shadow: 0 0 12px var(--bg);
	color: transparent;
}
</style>
