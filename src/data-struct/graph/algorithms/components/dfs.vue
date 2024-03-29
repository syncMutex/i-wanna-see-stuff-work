<script setup lang="ts">
import { ref, watch } from "vue";
import { algorithmState } from "../../../components/refs";
import Dfs from "../dfs";

const orderContainer = ref<null | HTMLDivElement>();

function done() {
	algorithmState.forceStopAlgorithm();
}

watch(Dfs.visited, () => {
	setTimeout(() => {
		if(orderContainer.value) {
			orderContainer.value.scrollTo({ top: orderContainer.value.scrollHeight, behavior: "smooth" });
		}
	}, 10);
})

</script>

<template>
<div class="dfs">
	<h1>DFS</h1>
	<h2>Order</h2>

	<div class="order scroll-bar" ref="orderContainer">
		<div v-for="n of Dfs.visited.value.values()">{{n.value.v.chars}}</div>
	</div>

	<button v-if="algorithmState.isDone" class="btn btn-nobg" @click="done">done</button>
</div>
</template>

<style scoped>
@import "../../../components/css/common.css";

.dfs{
	display: flex;
	flex-direction: column;
	width: 7rem;
	max-width: 12rem;
	height: 70%;
	position: absolute;
	left: 1rem;
	top: 5rem;
	border-radius: 4px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
	background-color: rgb(50, 50, 50);
	color: white;
	padding: 1rem;
}

h1{
	font-size: 1.5rem;
}

h2{
	font-size: 1.2rem;
	margin-top: 1rem;
	text-align: center;
}

.order{
	display: flex;
	flex-direction: column;
	align-items: center;
	align-self: center;
	width: 4rem;
	height: 70%;
	background-color: rgb(30, 30, 30);
	border-radius: 4px;
	padding: 0.5rem;
	overflow: auto;
	margin: 1rem 0;
}

.order div{
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 2rem;
	min-width: 2rem;
	height: 2rem;
	width: 2rem;
	background-color: rgb(13, 191, 73);
	margin-bottom: 0.2rem;
}

</style>
