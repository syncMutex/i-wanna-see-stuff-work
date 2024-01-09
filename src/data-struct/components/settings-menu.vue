<script setup lang="ts">
import { showToolBar, isMenuOpen, setIsMenuOpen } from "./refs";
import { playground } from "../handler/playground-handler";
import { setDelay, DELAY } from "../global";
import Range from "../../common-components/range.vue";

function setDisplayGrid() {
	playground.canvas.setIsDisplayGrid(!playground.canvas.isDisplayGrid);
}

</script>

<template>
<div v-if="showToolBar" id="menu-btn" class="floating-panel" @click.self="() => setIsMenuOpen(!isMenuOpen)">
	<div :class="['icon', isMenuOpen ? 'active' : '']">
		<div></div>
	</div>
	<section id="menu-section" class="floating-panel" v-if="isMenuOpen">
		<div @click="setDisplayGrid">
			<button>
				grid
			</button>
		</div>

		<div>
			<span>speed</span>
			<Range :min="10" :dir="'rtl'" :max="1000" :step="1" :value="DELAY"
				@input="(e: any) => setDelay(Number(e.target.value))"
			/>
		</div>
	</section>
</div>
</template>

<style scoped>
@import "./css/common.css";

#menu-btn{
	position: absolute;
	min-width: 2.5rem;
	min-height: 2.5rem;
	border-radius: 4px;
	cursor: pointer;
	z-index: 10;
	top: 0.5rem;
	left: 0.5rem;
}

#menu-section{
	top: 3rem;
	width: 10rem;
	height: 20rem;
	cursor: default;
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
	width: 100%;
	height: 100%;
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

</style>
