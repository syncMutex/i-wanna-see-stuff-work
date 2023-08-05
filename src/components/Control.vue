<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Sorter, SortingAlgorithm } from "../algorithms/sorter-iface.ts";

const props = defineProps<{
	curSorter: { sorter: Sorter, name: SortingAlgorithm },
	changeAlgorithm: (newAlg:SortingAlgorithm) => void,
}>();
const elementCount = ref(5);

const speeds: Array<[string, number]> = [
	['0.25x', 100],
	['0.5', 75],
	['1x', 50],
	['1.5', 25],
	['2x', 10],
	['2.5x', 1]
];

onMounted(() => {
	props.curSorter.sorter.changeElementsCount(elementCount.value);
});

function numberInput() {
	if(elementCount.value <= 0) {
		elementCount.value = 1;
	}
	props.curSorter.sorter.changeElementsCount(elementCount.value);
}

function incElementCount(mag: number) {
	elementCount.value += mag;
	numberInput();
}
</script>

<template>
	<div id="control">
		<div>
			<span>element count</span>
			<button @pointerdown="incElementCount(-1)">-</button>
			<input type="number" v-model="elementCount" @input="numberInput" />
			<button @pointerdown="incElementCount(1)">+</button>
		</div>
		<div>
			<span>speed</span>
			<button
				@click="props.curSorter.sorter.setAnimationDelay(delay)"
				v-for="([speed, delay], index) in speeds"
				:key="index"
			>
				{{speed}}
			</button>
		</div>
		<div>
			<span>sorting algorithm</span>
			<select @input="(e) => props.changeAlgorithm((e.target as any).value)">
				<option :selected="alg === curSorter.name" v-for="alg in SortingAlgorithm">{{alg}}</option>
			</select>
		</div>
		<div>
			<button @click="props.curSorter.sorter.shuffle">shuffle</button>
			<button @click="props.curSorter.sorter.changeValues">change values</button>
			<button @click="props.curSorter.sorter.play">play</button>
			<button @click="() => {
				elementCount = 5;
				props.curSorter.sorter.reset();
			}">reset</button>
			<button @click="props.curSorter.sorter.pause">pause</button>
			<button @click="props.curSorter.sorter.next">next</button>
		</div>
	</div>
</template>

<style scoped>
#control{
	width: 100%;
	height: 5rem;
	background-color: blue;
}
</style>
