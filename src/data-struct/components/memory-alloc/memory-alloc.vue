<script lang="ts" setup>
import { ref } from "vue";
import allocator from "../../memory-allocator/allocator";
import Select from "../../../common-components/select.vue";

enum Mode {
	Bytes = "bytes",
	String = "simplified"
}

const refreshToggle = ref(false);
const mode = ref(Mode.String);

function refresh() {
	refreshToggle.value = !refreshToggle.value;
}

</script>

<template>
<div id="memory-alloc" class="floating-panel">
	<div id="top-bar">
		<button @click="refresh" class="btn btn-nobg clr-blue">refresh</button>
		<Select
			:options="Mode"
			:onChange="(value) => mode = value as Mode"
			:value="mode"
		/>
	</div>
	<div id="alloc-container" :key="String(refreshToggle)">
		<template v-if="mode === Mode.Bytes">
			<span
				:style="block.isFree ? {} : { color: block.bg }"
				:class="['bytes', block.isFree ? 'freed' : '']"
				v-for="(block, idx) in allocator.allocated" :key="idx"
			>
				{{block.v.toBytes().join(" ") + " "}}
			</span>
		</template>

		<template v-if="mode === Mode.String">
			<span 
				:style="block.isFree ? {} : { backgroundColor: block.bg, color: block.fg }"
				:class="['simplified', block.isFree ? 'freed' : '']"
				v-for="(block, idx) in allocator.allocated" :key="idx"
			>
				{{" " + block.v + " "}}
			</span>
		</template>
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
	height: 2.5rem;
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 0.5rem;
}

#top-bar > * {
	margin-right: 1rem;
	min-height: 100%;
	height: 100%;
}

#alloc-container{
	overflow-y: auto;
	font-family: monospace;
	text-wrap: wrap;
	word-break: break-all;
	line-break: anywhere;
	white-space-collapse: break-spaces;
	padding: 0.5rem;
}

.bytes{
	color: white;
}

.simplified{
	border-radius: 5px;
	font-size: 0.7rem;
	margin-bottom: 0.3ch;
}

.bytes.freed{
	color: rgb(80, 80, 80);
}

.simplified.freed{
	background-color: rgb(80, 80, 80);
	color: grey;
	opacity: 0.4;
}
</style>
