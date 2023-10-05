<script setup lang="ts">
import { reactive, ref } from "vue";
import Control from "./Control.vue";
import Elements from "./Elements.vue";
import { Sorter, SortingAlgorithm } from "../algorithms/sorter-iface.ts";

import BubbleSort from "../algorithms/bubble-sort.ts";
import MergeSort from "../algorithms/merge-sort.ts";
import InsertionSort from "../algorithms/insertion-sort.ts";
import QuickSort from "../algorithms/quick-sort.ts";
import SelectionSort from "../algorithms/selection-sort.ts";

interface CurSorter {
	name: SortingAlgorithm,
	sorter: Sorter
}

const curSorter = reactive<CurSorter>({
	name: SortingAlgorithm.MergeSort,
	sorter: new MergeSort(playComplete),
});
const isPlaying = ref<boolean>(false);

function togglePlay() {
	if(isPlaying.value) {
		curSorter.sorter.pause();
	} else {
		curSorter.sorter.play();
	}
	isPlaying.value = !isPlaying.value;
}

function playComplete() {
	isPlaying.value = false;
}

function changeAlgorithm(newAlg: SortingAlgorithm) {
	curSorter.sorter.stop();
	curSorter.sorter.resetElements();

	const delay = curSorter.sorter.getDelay();
	const arr = [...curSorter.sorter.elements];

	switch(newAlg) {
		case SortingAlgorithm.BubbleSort:
			curSorter.sorter = new BubbleSort(playComplete);
			break;
		case SortingAlgorithm.MergeSort:
			curSorter.sorter = new MergeSort(playComplete);
			break;
		case SortingAlgorithm.InsertionSort:
			curSorter.sorter = new InsertionSort(playComplete);
			break;
		case SortingAlgorithm.SelectionSort:
			curSorter.sorter = new SelectionSort(playComplete);
			break;
		case SortingAlgorithm.QuickSort:
			curSorter.sorter = new QuickSort(playComplete);
			break;
	}

	curSorter.name = newAlg;
	curSorter.sorter.setElements(arr);
	curSorter.sorter.setAnimationDelay(delay);
}

</script>

<template>
	<div class="body-container">
		<Control
			:curSorter="curSorter as CurSorter"
			:changeAlgorithm="changeAlgorithm"
			:togglePlay="togglePlay"
			:isPlaying="isPlaying"
		/>
		<Elements :elements="curSorter.sorter.elements" />
		<div class="play-pause-next-container">
			<div class="play-pause-btns">
				<button class="play-btn" v-if="!isPlaying" @click="togglePlay"></button>
				<button class="pause-btn" v-else @click="togglePlay"></button>
			</div>
			<button class="next-btn" :disabled="isPlaying" @click="curSorter.sorter.next">
				<div></div>
			</button>
		</div>
	</div>
</template>

<style scoped>
*{
	--control-bg: rgb(26, 0, 61);
	--purple: rgb(112, 0, 255);
	--aqua: rgb(3, 252, 161);
	--pink: rgb(255, 0, 64);
	--element-height: 1.5rem;
}

.body-container{
	width: 100%;
	height: 100%;
	position: relative;
	display: flex;
	flex-direction: column;
}

.play-pause-next-container{
	display: flex;
	width: max-content;
	height: max-content;
	position: absolute;
	top: 7rem;
	left: 1rem;
}

.play-pause-btns{
	width: var(--element-height);
	height: var(--element-height);
	display: inline-block;
	margin-right: 1rem;
}

.play-pause-btns button{
	display: flex;
	position: relative;
	width: 100%;
	height: 100%;
	border: none;
	outline: none;
	cursor: pointer;
	border-radius: 2px;
}

.play-btn{
	background: var(--aqua);
	clip-path: polygon(100% 50%, 0% 0, 0% 100%);
}

.pause-btn{
	background-color: transparent;
}

.pause-btn::after, .pause-btn::before{
	content: "";
	background-color: var(--aqua);
	width: 20%;
	height: 100%;
	position: absolute;
}

.pause-btn::after{
	right: 10%;
}

.pause-btn::before{
	left: 10%;
}

.next-btn{
	--div-color: var(--aqua);
	width: var(--element-height);
	height: var(--element-height);
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	border: none;
	outline: none;
	cursor: pointer;
	background-color: transparent;
	padding: 0;
}

.next-btn > div{
	width: 100%;
	height: 100%;
	background: var(--div-color);
	-webkit-clip-path: polygon(40% 0, 100% 50%, 40% 100%, 0 100%, 60% 50%, 0 0);
	clip-path: polygon(40% 0, 100% 50%, 40% 100%, 0 100%, 60% 50%, 0 0);
	border-radius: 10px;
	transition: 0.5s all;
}

.next-btn:hover{
	background-color: transparent;
}

.next-btn:disabled{
	--div-color: grey;
	pointer-events: none;
}
</style>
