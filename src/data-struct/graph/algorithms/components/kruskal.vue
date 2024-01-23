<script setup lang="ts">
import { ref } from "vue";
import { algorithmState } from "../../../components/refs";
import { playground } from "../../../handler/playground-handler";
import kruskal from "../kruskal";

const table = ref<null | HTMLDivElement>(null);

function done() {
	kruskal.cleanup(playground.canvas);
	algorithmState.forceStopAlgorithm();
}

</script>

<template>
<div class="kruskal">
	<h1>Dijkstra</h1>
	<div class="dist-table">
		<div class="header">
			Edges
		</div>
		<div class="content scroll-bar" ref="table">
			<div class="row" v-for="e of kruskal.edges.value">
				<div class="node">{{e.fromNode.value}}</div>
				<div class="weight">{{e.weight}}</div>
				<div class="node">{{e.toNode.value}}</div>
			</div>
		</div>
	</div>

	<button v-if="algorithmState.isDone" class="btn btn-nobg" @click="done">done</button>
</div>
</template>

<style scoped>
@import "../../../components/css/common.css";

.kruskal{
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
	z-index: 50;
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
	background-color: rgb(30, 30, 30);
	max-height: 70%;
	margin: 0.5rem 0;
	overflow: hidden;
}

.content {
	overflow: auto;
}

.row{
	justify-content: center;
	display: flex;
	flex-direction: row;
	margin-bottom: 0.3rem;
	padding: 0 0.3rem;
}

.row div{
	text-align: center;
	padding: 0.2rem 0;
}

.node{
	background-color: rgb(132, 3, 252);
	border-radius: 4px;
	width: 2rem;
	height: 2rem;
	overflow: hidden;
}

.weight{
	font-size: 0.7rem;
}

.weight::after{
	content: "";
	display: block;
	width: 3rem;
	max-height: 3px;
	min-height: 3px;
	background-color: white;
}

.header{
	text-align: center;
	background-color: #c7fccc;
	color: rgb(0, 0, 0);
	border-top-left-radius: 4px;
	border-top-right-radius: 4px;
	justify-content: center;
	margin-bottom: 0.3rem;
}

.row.header div:first-child {
	border-right: 2px solid rgb(40, 40, 40);
}

@media only screen and (max-width: 550px) {
	.kruskal{
		display: flex;
		flex-direction: column;
		max-width: 90%;
		height: 30%;
		position: absolute;
		top: auto;
		left: auto;
		bottom: 1rem;
		border-radius: 4px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
		color: white;
		padding: 1rem;
	}
}

</style>
