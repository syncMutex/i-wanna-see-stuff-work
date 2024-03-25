<script lang="ts" setup>
import ToolBarSection from "./tool-bar.vue";
import PlaygroundSection from "./playground-section.vue";
import SelectedItem from "./selected-item.vue";
import SettingsMenu from "./settings-menu.vue";
import Algorithm from "./algorithm.vue";
import MemoryAlloc from "./memory-alloc/memory-alloc.vue";

</script>

<template>
<div class="pg-body">
	<SettingsMenu />
	<ToolBarSection />
	<PlaygroundSection />
	<SelectedItem />
	<Algorithm />
	<MemoryAlloc />
</div>
</template>

<style scoped>
.pg-body{
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: row;
	position: relative;
	align-items: center;
	justify-content: center;
}

</style>
