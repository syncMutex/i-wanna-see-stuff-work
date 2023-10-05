<script lang="ts" setup>
import { selectedElement, disablePointerEvents } from "../global";
import ToolNode from "./tools/tool-node.vue";

</script>

<template>
<div :class="[
		'selected-item floating-panel',
		disablePointerEvents ? 'pointer-events-none' : ''
	]" v-if="selectedElement.constructor.name === 'ElementNode'">
	<ToolNode />
</div>
</template>

<style scoped>
@import "./css/common.css";

.selected-item{
	left: 1%;
	top: 15%;
	z-index: 10;
	width: 12rem;
	height: 30rem;
	padding: 0.5rem;
	font-family: Arial, Helvetica, sans-serif;
}
</style>
