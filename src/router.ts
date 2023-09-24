import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import Sorting from "./views/sorting/components/TheBody.vue";
import LinkedList from "./views/linked-list/components/TheBody.vue";

const routes: Array<RouteRecordRaw> = [
	{ path: "/sorting", component: Sorting },
	{ path: "/linked-list", component: LinkedList },
];

const router = createRouter({
	history: createWebHistory(),
	routes
});

export default router;