<template>
	<svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
	<g id="d-edge">
	<path id="stroke" d="M0 61H124" stroke="white" stroke-width="5"/>
	<path id="arrow-head" d="M127.909 60.5911L105.549 73.2954L105.472 48.0229L127.909 60.5911Z" fill="white"/>
	</g>
	</svg>
</template>

<style scoped>
svg{
	transform: scale(1.7, 1.7);
}

svg.selected #stroke {
	stroke: var(--stroke-clr);
}

svg.selected #arrow-head {
	fill: var(--stroke-clr);
}
</style>
