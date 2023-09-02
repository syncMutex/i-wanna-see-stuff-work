<script lang="ts" setup>
import ToolBarSection from "./tool-bar-section.vue";
import PlaygroundSection from "./playground-section.vue";
</script>

<template>
<div class="linked-list-body">
	<ToolBarSection />
	<PlaygroundSection />
</div>
</template>

<style scoped>
.linked-list-body{
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: row;
	position: relative;
}

</style>
