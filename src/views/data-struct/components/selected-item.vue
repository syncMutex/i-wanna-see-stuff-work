<script lang="ts" setup>
import { selectedElement } from "../selected-item";
import ToolNode from "./tools/tool-node.vue";

</script>

<template>
<div class="selected-item floating-panel" v-if="selectedElement.constructor.name === 'ElementNode'">
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
}
</style>
