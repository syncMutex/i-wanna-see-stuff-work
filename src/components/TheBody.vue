<script setup lang="ts">
import { ref, reactive } from "vue";
import Control from "./Control.vue";
import Elements from "./Elements.vue";
import { Sorter, SortingAlgorithm } from "../algorithms/sorter-iface.ts";

import BubbleSort from "../algorithms/bubble-sort.ts";
import MergeSort from "../algorithms/merge-sort.ts";
import InsertionSort from "../algorithms/insertion-sort.ts";
import QuickSort from "../algorithms/quick-sort.ts";

const curSorterName = ref<SortingAlgorithm>(SortingAlgorithm.BubbleSort);

const curSorter = reactive<{sorter: Sorter}>({ sorter: new QuickSort() });

function changeAlgorithm(alg:SortingAlgorithm) {
	curSorter.sorter.reset();
	curSorterName.value = alg;
	const arr = [...curSorter.sorter.elements];
	switch(alg) {
		case SortingAlgorithm.BubbleSort:
			curSorter.sorter = new BubbleSort();
			break;
		case SortingAlgorithm.MergeSort:
			curSorter.sorter = new MergeSort();
			break;
		case SortingAlgorithm.InsertionSort:
			curSorter.sorter = new InsertionSort();
			break;
		case SortingAlgorithm.QuickSort:
			curSorter.sorter = new QuickSort();
			break;
	}

	curSorter.sorter.changeElementsCount(5);
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
