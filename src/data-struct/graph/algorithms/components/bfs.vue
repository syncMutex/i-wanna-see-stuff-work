<script setup lang="ts">
import { ref, watch } from "vue";
import { algorithmState } from "../../../components/refs";
import Bfs from "../bfs";

const orderContainer = ref<null | HTMLDivElement>();

function done() {
	algorithmState.alg = null;
}

watch(Bfs.visited, () => {
	setTimeout(() => {
		if(orderContainer.value) {
			orderContainer.value.scrollTo({ top: orderContainer.value.scrollHeight, behavior: "smooth" });
		}
	}, 10);
})

</script>

<template>
<div class="outter">
	<div class="bfs">
		<h1>BFS</h1>
		<h2>Order</h2>

		<div class="order scroll-bar" ref="orderContainer">
			<div v-for="n of Bfs.visited.value.values()">{{n.value}}</div>
		</div>

		<button v-if="algorithmState.isDone" class="btn btn-nobg" @click="done">done</button>
	</div>
	<div class="queue-container" v-if="!algorithmState.isDone">
		<h2>Queue</h2>
		<div class="queue scroll-bar" ref="orderContainer">
			<div v-for="n of Bfs.queue">{{n.value}}</div>
		</div>
	</div>
</div>
</template>

<style scoped>
@import "../../../components/css/common.css";

.outter{
	display: flex;
	flex-direction: column;
	justify-content: center;
	width: 100%;
	height: 100%;
	position: absolute;
	pointer-events: none;
}

.bfs{
	display: flex;
	flex-direction: column;
	position: relative;
	width: 7rem;
	max-width: 12rem;
	height: 70%;
	left: 1rem;
	border-radius: 4px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
	background-color: rgb(50, 50, 50);
	color: white;
	padding: 1rem;
	pointer-events: auto;
}

.queue-container{
	display: flex;
	flex-direction: column;
	align-self: center;
	position: relative;
	max-width: 50%;
	height: 7.5rem;
	border-radius: 4px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
	background-color: rgb(50, 50, 50);
	color: white;
	padding: 0.5rem;
	pointer-events: auto;
}

.queue{
	display: flex;
	flex-direction: row;
	align-items: center;
	background-color: rgb(30, 30, 30);
	border-radius: 4px;
	padding: 0.5rem;
	overflow: auto;
	margin: 0.5rem 0;
	min-height: 4rem;
	height: 4rem;
}

.queue div{
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 2rem;
	min-width: 2rem;
	height: 2rem;
	width: 2rem;
	background-color: rgb(162, 0, 255);
	margin-right: 0.2rem;
}

h1{
	font-size: 1.5rem;
	margin-bottom: 1rem;
}

h2{
	font-size: 1.2rem;
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
