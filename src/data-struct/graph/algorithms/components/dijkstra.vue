<script setup lang="ts">
import { algorithmState } from "../../../components/refs";
import { playground } from "../../../handler/playground-handler";
import dijkstra from "../dijkstra";
import Dijkstra from "../dijkstra";

function done() {
	dijkstra.cleanup(playground.canvas);
	algorithmState.forceStopAlgorithm();
}

</script>

<template>
<div class="dijkstra">
	<h1>Dijkstra</h1>
	<h2>Order</h2>

	<div class="dist-table scroll-bar">
		<div class="row header">
			<div>node</div>
			<div>distance</div>
		</div>
		<div class="row" v-for="n of Dijkstra.distanceTable.value">
			<div>{{n[0].value}}</div>
			<div>{{n[1].dist}}</div>
		</div>
	</div>

	<button v-if="algorithmState.isDone" class="btn btn-nobg" @click="done">done</button>
</div>
</template>

<style scoped>
@import "../../../components/css/common.css";

.dijkstra{
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: 11rem;
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

.dist-table{
	display: flex;
	flex-direction: column;
	width: 100%;
	background-color: red;
	border-radius: 4px;
	background-color: rgb(40, 40, 40);
}

.row{
	display: flex;
	flex-direction: row;
}

.row div{
	width: 50%;
	text-align: center;
}

.row.header{
	background-color: rgb(0, 255, 0);
	border-top-left-radius: 4px;
	border-top-right-radius: 4px;
}

</style>
