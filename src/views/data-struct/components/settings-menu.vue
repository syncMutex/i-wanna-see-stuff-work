<script setup lang="ts">
import refs from "./refs";
import { playground } from "../playground-handler";
import Range from "../../common-components/range.vue";
const { setIsMenuOpen, isMenuOpen } = refs;

function setZoom(dz: number) {
	playground.canvas.setZoom(dz);
}

</script>

<template>
	<div id="menu-btn" @click.self="() => setIsMenuOpen(!isMenuOpen)">
	<section id="menu-section" class="floating-panel" v-if="isMenuOpen">
		zoom
		<Range :dir="'ltr'" :min="0.5" :max="8" :step="0.01" :value="playground.canvas.zoom"
			@input="(e: any) => setZoom(Number(e.target.value))"
		/>
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
