<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Sorter, SortingAlgorithm } from "../algorithms/sorter-iface.ts";

const props = defineProps<{
	curSorter: { sorter: Sorter, name: SortingAlgorithm },
	changeAlgorithm: (newAlg:SortingAlgorithm) => void,
}>();
const elementCount = ref(5);

onMounted(() => {
	props.curSorter.sorter.changeElementsCount(elementCount.value);
});

let doInc = false;

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
		<div class="control-partition">
			<span>element count</span>
			<div class="element-count">
				<button @pointerdown="incElementCount(-1)"></button>
				<input type="number" v-model="elementCount" @input="numberInput" />
				<button @pointerdown="incElementCount(1)"></button>
			</div>
		</div>

		<div class="control-partition">
			<span>speed</span>
			<div class="speed">
				<input class="speed-inp"
					type="range"
					min="1"
					max="100" 
					@input="(e: any) => props.curSorter.sorter.setAnimationDelay(e.target.value)" 
				/>
			</div>
		</div>

		<div class="control-partition">
			<span>algorithm</span>
			<div class="algorithms-container">
				<select class="algorithms" @input="(e) => props.changeAlgorithm((e.target as any).value)">
					<option :selected="alg === curSorter.name" v-for="alg in SortingAlgorithm">{{alg}}</option>
				</select>
			</div>
		</div>

		<div class="control-partition">
			<span>control</span>
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

	</div>
</template>

<style scoped>
#control{
	width: 100%;
	height: 5rem;
	background-color: rgb(26, 0, 61);
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
	min-width: 10rem;
	padding-top: 1rem;
}

.control-partition > span{
	position: absolute;
	font-weight: 600;
	font-size: 0.8rem;
	color: rgb(255, 0, 72);
	color: white;
	top: 0.5rem;
}

.element-count{
	display: flex;
	flex-direction: row;
}

.element-count input{
	width: 4rem;
	height: 1.5rem;
	border: none;
	background-color: rgb(112, 0, 255);
	box-shadow: 0 0 5px rgb(112, 0, 255);
	color: white;
	padding-left: 0.3rem; 
	font-weight: 600;
	outline: none;
	border-radius: 4px;
	margin: 0 0.2rem;
}

.element-count button{
	--color: white;
	width: 1.5rem;
	height: 1.5rem;
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
	--color: rgb(26, 0, 61);
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

.speed{
	display: flex;
	justify-content: center;
	align-items: center;
}

.speed-inp{
	--track-height: 0.2rem;
	--thumb-width: 1rem;
	--thumb-height: 0.5rem;
	direction: rtl;	
	-webkit-appearance: none;
	appearance: none;
	cursor: pointer;
	background: transparent;
}

.speed-inp:hover{
	--thumb-width: 1rem;
	--thumb-height: 1rem;
}

.speed-inp::-webkit-slider-runnable-track{
	--bg: rgb(3, 252, 161);
	background: var(--bg);
	height: var(--track-height);
	border-radius: 1rem;
	transition: all 0.3s;
}

.speed-inp:hover::-webkit-slider-runnable-track{
	--track-height: 0.4rem;
	box-shadow: 0 0 5px var(--bg);
}

.speed-inp::-webkit-slider-thumb{
	--bg: white;
	-webkit-appearance: none;
	appearance: none;
	width: var(--thumb-width);
	height: var(--thumb-height);
	background: white;
	box-shadow: 0 0 1px var(--bg);
	border-radius: 1rem;
	margin-top: calc(var(--thumb-height) / 2 * -1 + var(--track-height) / 2);
	transition: all 0.3s;
}

.speed-inp:hover::-webkit-slider-thumb{
	box-shadow: 0 0 8px var(--bg);
}

.algorithms{
	appearance: none;
	-webkit-appearance: none;
	outline: 0;
	width: 7rem;
	height: 1.7rem;
	border: none;
	border-radius: 4px;
	background: rgb(255, 0, 64);
	box-shadow: 0 0 10px rgb(255, 0, 64);
	color: white;
	padding-left: 0.5rem;
	font-weight: 600;
	display: block;
	cursor: pointer;
}

.algorithms > option {
	font-weight: 600;
	background-color: black;
}

.algorithms > option:hover {
	background-color: white;
}

.algorithms-container{
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
}

.algorithms-container::after{
	content: "";
	display: block;
	position: absolute;
	right: 5%;
	width: 0.8em;
	height: 0.5em;
	background-color: white;
	clip-path: polygon(100% 0%, 0 0%, 50% 100%);
	pointer-events: none;
}
</style>
