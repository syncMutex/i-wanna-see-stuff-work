<script setup lang="ts">
import { showToolBar, isMenuOpen, setIsMenuOpen, setIsMemAllocShow, isMemAllocShow, isSelectedItemShow, setIsSelectedItemShow } from "./refs";
import { playground } from "../handler/playground-handler";
import { setDelay, DELAY, focusedElement } from "../global";
import Range from "../../common-components/range.vue";
import ToolIcon from "../assets/icons/spawner.svg";
import RamIcon from "../assets/icons/ram.svg";
import { componentMap } from "./tool-component-map";

function setDisplayGrid() {
	playground.canvas.setIsDisplayGrid(!playground.canvas.isDisplayGrid);
}

</script>

<template>
<div v-if="showToolBar" id="btn-container">
	<div id="menu-btn" @click.self="() => setIsMenuOpen(!isMenuOpen)">
		<div :class="['icon', isMenuOpen ? 'active' : '']">
			<div></div>
		</div>
		<section id="menu-section" class="floating-panel" v-if="isMenuOpen">
			<div>
				<button class="btn btn-nobg" @click="setDisplayGrid">
					Toggle-grid
				</button>
			</div>

			<div>
				<span>Animation speed: </span>
				<Range :min="10" :dir="'rtl'" :max="1000" :step="1" :value="DELAY" class="speed"
					@input="(e: any) => setDelay(Number(e.target.value))"
				/>
			</div>
		</section>
	</div>

	<div id="mem-alloc-btn" v-if="!isMemAllocShow" @click="setIsMemAllocShow(true)">
		<img :src="RamIcon" alt="">
	</div>

	<div
		id="selected-item-btn"
		v-if="!isSelectedItemShow && focusedElement.constructor.name in componentMap"
		@click="setIsSelectedItemShow(true)"
	>
		<img :src="ToolIcon" alt="">
	</div>
</div>

</template>

<style scoped>
@import "./css/common.css";

#btn-container{
	display: flex;
	flex-direction: column;
	position: absolute;
	top: 0.5rem;
	left: 0.5rem;
	--btn-size: 2rem;
	min-width: max-content;
	min-height: max-content;
	z-index: 15;
}

#btn-container > *{
	margin-bottom: 0.5rem;
	border-radius: 5px;
	cursor: pointer;
}

#menu-section{
	left: calc(var(--btn-size) + 0.2rem);
	padding: 0.5rem;
	width: 10rem;
	height: 20rem;
	cursor: default;
	font-size: 0.9rem;
}

#menu-section div {
	margin-bottom: 1rem;
}

.speed{
	margin-top: 0.5rem;
	width: max-content;
}

.icon.active{
	outline: 2px solid white;
	border-radius: 4px;
}

.icon{
	display: flex;
	justify-content: center;
	align-items: center;
	pointer-events: none;
	width: var(--btn-size);
	height: var(--btn-size);
	position: absolute;
}

.icon > div, .icon::before, .icon::after{
	position: absolute;
	width: 70%;
	height: 3px;
	background-color: white;
	border-radius: 5px;
}

.icon::before, .icon::after{
	content: "";
	display: block;
}

.icon::before{
	top: 26%;
}

.icon::after{
	bottom: 26%;
}

#mem-alloc-btn, #selected-item-btn, #menu-btn{
	min-width: var(--btn-size);
	min-height: var(--btn-size);
	width: var(--btn-size);
	height: var(--btn-size);
	background-color: #333333;
}

#mem-alloc-btn:hover, #selected-item-btn:hover, #menu-btn:hover{
	background-color: #555555;
}

#mem-alloc-btn img, #selected-item-btn img{
	width: 100%;
	height: 100%;
}

#mem-alloc-btn, #selected-item-btn{
	padding: 0.2rem;
}

</style>
