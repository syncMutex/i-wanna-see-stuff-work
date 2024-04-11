<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Sorter, SortingAlgorithm } from "../algorithms/sorter-iface.ts";
import Range from "../../common-components/range.vue";
import Select from "../../common-components/select.vue";

const props = defineProps<{
	curSorter: {
		sorter: Sorter,
		name: SortingAlgorithm,
	},
	togglePlay: () => void,
	isPlaying: boolean,
	changeAlgorithm: (newAlg:SortingAlgorithm) => void
}>();

const elementCount = ref(5);
let max = Math.floor(window.innerWidth / 3);

function validateNumberInput() {
	if(+elementCount.value <= 0) {
		elementCount.value = 1;
		numberInput();
	}

	if(+elementCount.value > max) {
		elementCount.value = max;
		numberInput();
	}
}

function resizeEvent() {
	max = Math.floor(window.innerWidth / 3);
	validateNumberInput();
}

function numberInput() {
	if(elementCount.value > 0 && elementCount.value <= max) {
		props.curSorter.sorter.changeElementsCount(elementCount.value);
	}
}

function incElementCount(mag: number) {
	elementCount.value += mag;
	numberInput();
}

onMounted(() => {
	props.curSorter.sorter.changeElementsCount(elementCount.value);
	window.addEventListener('resize', resizeEvent);
});

onUnmounted(() => {
	window.removeEventListener('resize', resizeEvent);
});
</script>

<template>
	<div id="control" class="scroll-bar">
		<div class="control-partition">
			<span>element count</span>
			<div class="element-count">
				<button @pointerdown="incElementCount(-1)"></button>
				<input type="number" v-model="elementCount" @focusout="validateNumberInput" @input="numberInput" />
				<button @pointerdown="incElementCount(1)"></button>
			</div>
		</div>

		<div class="control-partition">
			<span>speed</span>
			<Range
				:step="1"
				:value="50"
				:dir="'rtl'"
				:min="1"
				:max="100" 
				@input="(e: any) => props.curSorter.sorter.setAnimationDelay(e.target.value)" 
			/>
		</div>

		<div class="control-partition">
			<span>algorithm</span>
			<div class="custom-select-container select-container">
				<Select
					:options="SortingAlgorithm"
					:onChange="(value) => changeAlgorithm(value as SortingAlgorithm)"
					:value="curSorter.name"
					class="algorithms"
				/>
			</div>
		</div>

		<div class="control-partition">
			<div class="control-btns">
				<button @click="() => {
					elementCount = 5;
					props.curSorter.sorter.reset();
				}">reset</button>
				<button @click="props.curSorter.sorter.shuffle">shuffle</button>
				<button @click="props.curSorter.sorter.changeValues">change values</button>
			</div>
		</div>

	</div>
</template>


<style scoped>
@import "../../data-struct/components/css/common.css";

*{
	--control-bg: rgb(26, 0, 61);
	--purple: rgb(112, 0, 255);
	--aqua: rgb(3, 252, 161);
	--pink: rgb(255, 0, 64);
	--element-height: 1.5rem;
}

#control{
	width: 100%;
	height: 6rem;
	background-color: var(--control-bg);
	display: flex;
	flex-direction: row;
	align-items: center;
	font-family: Arial, Helvetica, sans-serif;
	overflow-x: auto;
	border-bottom: 2px solid rgb(0, 0, 255);
	position: relative;
}

.control-partition{
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin-left: 1rem;
	height: 100%;
	width: max-content;
	padding-top: 1.5rem;
}

.control-partition > span{
	position: absolute;
	font-weight: 600;
	font-size: 0.8rem;
	color: white;
	top: 1rem;
}

.element-count{
	display: flex;
	flex-direction: row;
}

.element-count input{
	width: 4rem;
	height: var(--element-height);
	border: none;
	background-color: var(--purple);
	box-shadow: 0 0 5px var(--purple);
	color: white;
	padding-left: 0.3rem; 
	font-weight: 600;
	outline: none;
	border-radius: 4px;
	margin: 0 0.2rem;
}

.element-count button{
	--color: white;
	width: var(--element-height);
	height: var(--element-height);
	border: none;
	font-size: 1.5rem;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: transparent;
	border-radius: 4px;
}

.element-count button:hover{
	cursor: pointer;
	--color: var(--control-bg);
	background-color: white;
	position: relative;
}

.element-count button:first-child::before{
	content: "";
	width: 0.7rem;
	height: 3px;
	background-color: var(--color);
}

.element-count button:last-child::before{
	content: "";
	width: 0.7rem;
	height: 3px;
	background-color: var(--color);
}

.element-count button:last-child::after{
	position: absolute;
	content: "";
	height: 0.7rem;
	width: 3px;
	background-color: var(--color);
}

.select-container {
	width: 7.5rem;
}

.algorithms{
	width: 100%;
	height: 1.7rem;
	border: none;
	background: var(--pink);
	box-shadow: 0 0 10px var(--pink);
	color: white;
}

.algorithms > option {
	font-weight: 600;
	background-color: black;
}

.algorithms > option:hover {
	background-color: white;
}

.control-btns{
	display: flex;
	flex-direction: row;
	width: max-content;
}

.control-btns button {
	height: var(--element-height);
	padding: 0 0.5rem;
	outline: none;
	border-radius: 4px;
	font-weight: 500;
	cursor: pointer;
	color: white;
	border: 2px solid white;
	background-color: transparent;
	transition: all 0.2s;
	font-weight: 600;
}

.control-btns > button:hover {
	background-color: white;
	color: var(--control-bg);
}

.control-btns > *{
	margin: 0 0.3rem;
}

</style>
