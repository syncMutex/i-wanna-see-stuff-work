<script setup lang="ts">
import { algorithmState } from "../../../components/refs";
import { playground } from "../../../handler/playground-handler";
import astar from "../astar";

function done() {
	astar.cleanup(playground.canvas);
	algorithmState.forceStopAlgorithm();
}

</script>

<template>
<div class="astar">
	<h1>A*</h1>
	<div class="dist-table">
		<div class="row header">
			<div>node</div>
			<div>f</div>
			<div>g</div>
		</div>
		<div class="content scroll-bar">
			<div class="row" v-for="n of astar.distanceTable.value">
				<div>{{n[0].value.v.chars}}</div>
				<div>{{n[1].f.toFixed(1)}}</div>
				<div>{{n[1].g.toFixed(1)}}</div>
			</div>
		</div>
	</div>

	<button v-if="algorithmState.isDone" class="btn btn-nobg" @click="done">done</button>
</div>
</template>

<style scoped>
@import "@css/common.css";

.astar{
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
	display: flex;
	flex-direction: row;
}

.row div{
	width: 50%;
	text-align: center;
	padding: 0.2rem 0;
}

.row.header{
	background-color: #c7fccc;
	color: rgb(0, 0, 0);
	border-top-left-radius: 4px;
	border-top-right-radius: 4px;
}

.row.header div:first-child,
.row.header div:nth-child(2) {
	border-right: 2px solid rgb(40, 40, 40);
}

@media only screen and (max-width: 550px) {
	.astar{
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
