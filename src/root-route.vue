<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
	<div id="root-route">
		<h1>Want to see how the stuff work?</h1>
		<router-link to="/sorting">
			<button class="btn btn-nobg clr-yellow">
				Sorting
			</button>
		</router-link>
		<router-link to="/dsa">
			<button class="btn btn-nobg">
				DSA
			</button>
		</router-link>
	</div>
</template>

<style scoped>
@import url("./data-struct/components/css/common.css");

#root-route{
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	position: relative;
}

#root-route > *{
	margin-top: 1rem;
	font-family: monospace;
}

.btn{
	font-family: monospace;
	text-decoration: none;
}

h1{
	color: white;
	text-align: center;
	font-size: 1.5rem;
}
</style>
