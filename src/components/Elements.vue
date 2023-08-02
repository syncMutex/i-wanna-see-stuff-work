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
	background-color: #565656;
}

.element {
	min-width: 1px;
	max-width: 100%;
	width: 100%;
	background-color: white;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
}

.traversing {
	background-color: blue;
	color: white;
}

.compare {
	background-color: yellow;
	color: black;
}

.swap {
	background-color: red;
	color: white;
}

.swap-done {
	background-color: green;
	color: white;
}

.moving {
	background-color: purple;
	color: white;
}
</style>
