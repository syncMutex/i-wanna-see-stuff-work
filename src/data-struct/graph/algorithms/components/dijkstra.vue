<script setup lang="ts">
import { algorithmState } from "../../../components/refs";
import Dijkstra from "../dijkstra";

function done() {
	algorithmState.forceStopAlgorithm();
}

</script>

<template>
<div class="dijkstra">
	<h1>Dijkstra</h1>
	<h2>Order</h2>

	<div class="order scroll-bar" ref="orderContainer">
		<div v-for="n of Dijkstra.distanceTable.value">{{n[0].value}} : {{n[1].dist}}</div>
	</div>

	<button v-if="algorithmState.isDone" class="btn btn-nobg" @click="done">done</button>
</div>
</template>

<style scoped>
@import "../../../components/css/common.css";

.dijkstra{
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

</style>
