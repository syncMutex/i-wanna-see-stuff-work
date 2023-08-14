<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Sorter, SortingAlgorithm } from "../algorithms/sorter-iface.ts";

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

onMounted(() => {
	props.curSorter.sorter.changeElementsCount(elementCount.value);
});

function numberInput() {
	if(elementCount.value > 0) {
		props.curSorter.sorter.changeElementsCount(elementCount.value);
	}
}

function focusOut() {
	if(+elementCount.value <= 0) {
		elementCount.value = 1;
		numberInput();
	}
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
				<input type="number" v-model="elementCount" @focusout="focusOut" @input="numberInput" />
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
			<div class="control-btns">
				<button @click="() => {
					elementCount = 5;
					props.curSorter.sorter.reset();
				}">reset</button>
				<button @click="props.curSorter.sorter.shuffle">shuffle</button>
				<button @click="props.curSorter.sorter.changeValues">change values</button>
				<div class="play-pause-btns">
					<button class="play-btn" v-if="!props.isPlaying" @click="props.togglePlay"></button>
					<button class="pause-btn" v-else @click="props.togglePlay"></button>
				</div>
				<button class="next-btn" :disabled="props.isPlaying" @click="props.curSorter.sorter.next">
					<div></div>
				</button>
			</div>
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
	--bg: var(--aqua);
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
	background: var(--pink);
	box-shadow: 0 0 10px var(--pink);
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

.control-btns{
	display: flex;
	flex-direction: row;
	width: max-content;
}

.control-btns > button {
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

.play-pause-btns{
	width: var(--element-height);
	height: var(--element-height);
	display: inline-block;
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

.control-btns .next-btn{
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

.control-btns .next-btn:hover{
	background-color: transparent;
}

.next-btn:disabled{
	--div-color: grey;
	pointer-events: none;
}

</style>
