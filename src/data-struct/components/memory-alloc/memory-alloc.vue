<script lang="ts" setup>
import { ref } from "vue";
import Select from "../../../common-components/select.vue";
import BytesView from "./bytes-view.vue";
import SimplifiedView from "./simplified-view.vue";

enum Mode {
	Bytes = "bytes",
	String = "simplified"
}
const mode = ref(Mode.Bytes);

</script>

<template>
<div id="memory-alloc" class="floating-panel">
	<div id="top-bar">
		<div class="custom-select-container">
			<Select :options="Mode" :onChange="(value) => mode = value as Mode" :value="mode" />
		</div>
	</div>

	<div id="alloc-container" class="scroll-bar">
		<BytesView v-if="mode === Mode.Bytes" />
		<SimplifiedView v-if="mode === Mode.String" />
	</div>
</div>
</template>

<style>
@import "../css/common.css";

*{
	--chars: #1a821a;
	--str: #57c95e;
	--lnode: #8400ff;
	--null: #ffffff;
}

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
	height: 2.5rem;
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 0.25rem;
}

#top-bar > * {
	margin-right: 1rem;
	min-height: 100%;
	height: 100%;
}

#alloc-container{
	display: flex;
	flex-direction: row;
	height: 100%;
	overflow-y: auto;
	padding: 0.5rem;
}

</style>
