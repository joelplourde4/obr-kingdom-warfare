import { createRouter, createWebHistory } from "vue-router";
import { createApp } from "vue";
import ToolSelector from "./components/ToolSelector.vue"

import '../src/style.css'

export const TOOL_ID: string = "obr.kingdom-warfare/tool";
export const TOOL_METADATA_KEY: string = "com.obr.kingdom-warfare/tool/metadata";

const routes = [
    { 
        path: '/:catchAll(.*)',
        name: 'ToolSelector',
        component: ToolSelector,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

const app = createApp(ToolSelector)
app.use(router)
app.mount('#app')