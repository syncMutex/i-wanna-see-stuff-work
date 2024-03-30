<script lang="ts" setup>
import { ref } from "vue";
import Select from "../../../common-components/select.vue";
import BytesView from "./bytes-view.vue";
import SimplifiedView from "./simplified-view.vue";

enum Mode {
	Bytes = "Bytes",
	String = "Simplified"
}

const byteAlign: any = { "auto": "auto", "4": 4, "8": 8, "16": 16, "32": 32, "64": 64 };
const mode = ref(Mode.String);
const curByteAlign = ref<"auto" | number>("auto");
const showAddressOnHover = ref<boolean>(false);
const allocContainerDiv = ref<Element | null>(null);

</script>

<template>
<div id="memory-alloc" class="floating-panel">
	<div id="top-bar" class="scroll-bar">
		<div class="mode-container">
			<div :style="{ color: Mode.Bytes === mode ? 'white' : '#444444' }">{{ Mode.Bytes }}</div>
			<div :class="['switch', mode]" @click="() => mode = mode === Mode.String ? Mode.Bytes : Mode.String"></div>
			<div :style="{ color: Mode.String === mode ? 'white' : '#444444' }">{{ Mode.String }}</div>
		</div>

		<div class="custom-select-container" v-if="mode === Mode.Bytes">
			<pre>Align: </pre>
			<Select :options="byteAlign as any" :onChange="(value) => curByteAlign = value as any" :value="curByteAlign as string" />
		</div>

		<div class="hover-address" v-if="mode === Mode.String">
			<input type="checkbox" v-model="showAddressOnHover" />
			<label>Show address on hover</label>
		</div>
	</div>

	<div id="alloc-container" class="scroll-bar" ref="allocContainerDiv">
		<BytesView v-if="mode === Mode.Bytes" :byteAlign="byteAlign[curByteAlign as any]" :parentDiv="allocContainerDiv" />
		<SimplifiedView v-if="mode === Mode.String" :showAddressOnHover="showAddressOnHover" :parentDiv="allocContainerDiv" />
	</div>
</div>
</template>

<style>
@import "../css/common.css";

*{
	--chars: #1a821a;
	--str: #57c95e;
	--lnode: #8400ff;
	--gnode: #ff801f;
	--null: #ffffff;
	--edge: #0abcde;
	--list: #ff00ff;
	--list-map: #cf5d5d;
	--adj-mat: #fffb91;
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
	background-color: rgb(15, 15, 15);
	width: 100%;
	height: 3rem;
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 0.25rem;
	overflow-x: auto;
	overflow-y: hidden;
}

#top-bar::-webkit-scrollbar{
	height: 4px;
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

.mode-container{
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-around;
	font-size: 0.8rem;
	font-family: monospace;
	padding: 0.3rem;
	color: white;
}

.switch{
	width: 2rem;
	height: 1rem;
	border-radius: 50px;
	margin: 0 0.5rem;
	cursor: pointer;
}

.switch.Bytes{
	background-color: rgb(40, 40, 40);
}

.switch.Simplified{
	background-color: rgb(40, 40, 40);
}

.switch::before{
	content: "";
	display: block;
	width: 1rem;
	height: 100%;
	background-color: white;
	border-radius: 7px;
	transition: transform 0.2s;
}

.switch.Simplified::before{
	transform: translateX(100%);
}

.hover-address{
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	font-family: monospace;
	min-width: max-content;
}

.hover-address input[type="checkbox"] {
	--size: 0.9rem;
	width: var(--size);
	height: var(--size);
	margin-right: 0.2rem;
	cursor: pointer;
}

</style>
