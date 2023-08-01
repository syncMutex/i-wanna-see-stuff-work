<script setup lang="ts">
import { ref, reactive } from "vue";
import Control from "./Control.vue";
import Elements from "./Elements.vue";
import { Sorter, SortingAlgorithm } from "../algorithms/sorter-iface.ts";

import BubbleSort from "../algorithms/bubble-sort.ts";
import MergeSort from "../algorithms/merge-sort.ts";

const curSorterName = ref<SortingAlgorithm>(SortingAlgorithm.BubbleSort);

const curSorter = reactive<{sorter: Sorter}>({ sorter: new BubbleSort() });

function changeAlgorithm(alg:SortingAlgorithm) {
	curSorterName.value = alg;
	const arr = [...curSorter.sorter.elements];
	switch(alg) {
		case SortingAlgorithm.BubbleSort:
			curSorter.sorter = new BubbleSort();
			break;
		case SortingAlgorithm.MergeSort:
			curSorter.sorter = new MergeSort();
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
