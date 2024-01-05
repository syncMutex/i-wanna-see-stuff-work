<script setup lang="ts">
import Dfs from "../dfs";

</script>

<template>
<div class="dfs">
	<div v-for="n of Dfs.visited.value.values()">{{n.value}}</div>
</div>
</template>

<style scoped>
.dfs{
	width: 50%;
	max-width: 12rem;
	height: 50%;
	position: absolute;
	left: 1rem;
	top: 5rem;
	border-radius: 4px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
	background-color: rgb(50, 50, 50);
}
</style>
