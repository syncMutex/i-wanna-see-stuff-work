<script setup lang="ts">
import refs from "./refs";
import { playground } from "../handler/playground-handler";
const { setIsMenuOpen, isMenuOpen } = refs;

function setDisplayGrid() {
	playground.canvas.setIsDisplayGrid(!playground.canvas.isDisplayGrid);
}

</script>

<template>
	<div id="menu-btn" @click.self="() => setIsMenuOpen(!isMenuOpen)">
	<section id="menu-section" class="floating-panel" v-if="isMenuOpen">
		<div @click="setDisplayGrid">
			<button>
				grid
			</button>
		</div>
	</section>
</div>
</template>

<style scoped>
@import "./css/common.css";

#menu-btn{
	position: absolute;
	left: 1%;
	top: 2%;
	width: 2.5rem;
	height: 2.5rem;
	background-color: red;
	z-index: 20;
}

#menu-section{
	top: 3rem;
	width: 10rem;
	height: 20rem;
}

</style>
