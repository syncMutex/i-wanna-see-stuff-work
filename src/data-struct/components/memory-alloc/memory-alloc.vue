<script lang="ts" setup>
import allocator from "../../memory-allocator/allocator";

// import { watchEffect } from "vue";
// watchEffect(() => {
// 	allocator.allocated.forEach(a => {
// 		console.log(a, a.v.getBytes());
// 	})
// })

function refresh() {
	allocator.refreshToggle = !allocator.refreshToggle;
}

</script>

<template>
<div id="memory-alloc" class="floating-panel">
	<div id="top-bar">
		<button @click="refresh">refresh</button>
	</div>
	<div id="alloc-container">
		<div v-for="block in allocator.allocated">
			{{block}} 
			<div>
				{{block.v}}
			</div>
			<div>
				{{block.v.toBytes().join(" ")}}
			</div>
			<br>
		</div>
	</div>
</div>
</template>

<style scoped>
@import "../css/common.css";

#memory-alloc{
	position: absolute;
	width: 90%;
	height: 40%;
	bottom: 1%;
	z-index: 100;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}

#top-bar{
	background-color: rgb(10, 10, 10);
	width: 100%;
	height: 1.75rem;
}

#alloc-container{
	overflow: auto;
}
</style>
