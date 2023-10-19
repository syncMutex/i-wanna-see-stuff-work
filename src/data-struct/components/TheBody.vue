<script lang="ts" setup>
import ToolBarSection from "./tool-bar.vue";
import PlaygroundSection from "./playground-section.vue";
import SelectedItem from "./selected-item.vue";
// import SettingsMenu from "./settings-menu.vue";

</script>

<template>
<div class="linked-list-body">
	<!-- <SettingsMenu /> -->
	<ToolBarSection />
	<PlaygroundSection />
	<SelectedItem />
</div>
</template>

<style scoped>
.linked-list-body{
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: row;
	position: relative;
	align-items: center;
	justify-content: center;
}

</style>
