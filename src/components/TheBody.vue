<script setup lang="ts">
import { reactive } from "vue";
import Control from "./Control.vue";
import Elements from "./Elements.vue";
import { Sorter, SortingAlgorithm } from "../algorithms/sorter-iface.ts";

import BubbleSort from "../algorithms/bubble-sort.ts";
import MergeSort from "../algorithms/merge-sort.ts";
import InsertionSort from "../algorithms/insertion-sort.ts";
import QuickSort from "../algorithms/quick-sort.ts";
import SelectionSort from "../algorithms/selection-sort.ts";

type CurSorter = {
	sorter: Sorter,
	name: SortingAlgorithm
}

const curSorter = reactive<CurSorter>({
	name: SortingAlgorithm.QuickSort,
	sorter: new QuickSort()
});

function changeAlgorithm(newAlg: SortingAlgorithm) {
	curSorter.sorter.stop();
	curSorter.sorter.resetElements();
	const arr = [...curSorter.sorter.elements];
	switch(newAlg) {
		case SortingAlgorithm.BubbleSort:
			curSorter.sorter = new BubbleSort();
			break;
		case SortingAlgorithm.MergeSort:
			curSorter.sorter = new MergeSort();
			break;
		case SortingAlgorithm.InsertionSort:
			curSorter.sorter = new InsertionSort();
			break;
		case SortingAlgorithm.SelectionSort:
			curSorter.sorter = new SelectionSort();
			break;
		case SortingAlgorithm.QuickSort:
			curSorter.sorter = new QuickSort();
			break;
	}

	curSorter.name = newAlg;
	curSorter.sorter.setElements(arr);
}

</script>

<template>
	<Control
		:curSorter="curSorter"
		:changeAlgorithm="changeAlgorithm"
	/>
	<Elements :elements="curSorter.sorter.elements" />
</template>

<style scoped>
</style>
