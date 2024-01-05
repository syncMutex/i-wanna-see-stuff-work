<script lang="ts" setup>
import { curAlgorithm } from "./refs";
import { disablePointerEvents } from "../global";

import Dfs from "../graph/algorithms/dfs";
import DfsComp from "../graph/algorithms/components/dfs.vue";
import { ref } from "vue";
import { playground } from "../handler/playground-handler";

type ComponentMap = { [_:string]: any };

const componentMap: ComponentMap = {
	[Dfs.constructor.name]: DfsComp,
};

const isPlaying = ref(true);

function togglePlay() {
	isPlaying.value = !isPlaying.value;

	if(isPlaying.value) {
		curAlgorithm.value?.play(playground.canvas);
	} else {
		curAlgorithm.value?.pause();
	}
}

function stop() {
	curAlgorithm.value?.stop(playground.canvas);
}

</script>

<template>
	<div
		:class="['play-pause-next-container', disablePointerEvents ? 'pointer-events-none' : '']"
		v-if="curAlgorithm && curAlgorithm.constructor.name in componentMap"
	>
		<div class="stop-btn" @click="stop"></div>
		<div class="play-pause-btns">
			<button class="play-btn" v-if="!isPlaying" @click="togglePlay"></button>
			<button class="pause-btn" v-else @click="togglePlay"></button>
		</div>
		<button class="next-btn" :disabled="isPlaying" @click="curAlgorithm.next(playground.canvas)">
			<div></div>
		</button>
	</div>

	<component
		:class="[disablePointerEvents ? 'pointer-events-none' : '']"
		v-if="curAlgorithm && curAlgorithm.constructor.name in componentMap"
		:is="componentMap[curAlgorithm.constructor.name]"
	></component>
</template>

<style scoped>
@import "./css/common.css";

*{
	--control-bg: rgb(26, 0, 61);
	--purple: rgb(112, 0, 255);
	--aqua: rgb(3, 252, 161);
	--pink: rgb(255, 0, 64);
	--element-height: 1.3rem;
}

.additional-info{
	position: absolute;
}

.play-pause-next-container{
	display: flex;
	width: max-content;
	height: max-content;
	position: absolute;
	bottom: 10%;
	background-color: #303030;
	border-radius: 4px;
	padding: 0.5rem;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.stop-btn{
	width: var(--element-height);
	height: var(--element-height);
	background-color: red;
	border-radius: 4px;
	cursor: pointer;
}

.play-pause-btns{
	width: var(--element-height);
	height: var(--element-height);
	display: inline-block;
	margin: 0 1rem;
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
