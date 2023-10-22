<script lang="ts" setup>
import { computed } from "vue";
import { selectedElement, disablePointerEvents } from "../global";

import { ElementLLNode } from "../linked-list/el-node";
import { ElementGNode } from "../graph/el-node";
import { ElementUEdge } from "../graph/el-u-edge";

import LLNode from "./tools/ll-node.vue";
import GNode from "./tools/g-node.vue";
import UEdge from "./tools/u-edge.vue";

const className = computed(() => {
	return ['selected-item floating-panel', disablePointerEvents.value ? 'pointer-events-none' : '']
});

type ComponentMap = { [_:string]: any };

const componentMap: ComponentMap = {
	[ElementLLNode.name]: LLNode,
	[ElementGNode.name]: GNode,
	[ElementUEdge.name]: UEdge
};

</script>

<template>
<div :class="className" v-if="selectedElement.constructor.name in componentMap">
	<component :is="componentMap[selectedElement.constructor.name]"></component>
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
