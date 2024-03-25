<script lang="ts" setup>
import { watchEffect } from "vue";
import allocator from "../../memory-allocator/allocator";

watchEffect(() => {
	allocator.allocated.forEach(a => {
		console.log(a, a.value.getBytes());
	})
})

</script>

<template>
<div id="memory-alloc" class="floating-panel">
	<div class="top-bar">
	</div>
	<div>
		<div v-for="block in allocator.allocated">
			<div>
				{{block.value.getString()}}
			</div>
			<div>
				{{block.value.getBytes().join(" ")}}
			</div>
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
}

.top-bar{
	background-color: rgb(10, 10, 10);
	width: 100%;
	height: 1.75rem;
}
</style>
