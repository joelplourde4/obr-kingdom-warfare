import { createApp } from 'vue'

import { createWebHistory, createRouter } from 'vue-router'
import Unit from './Unit.vue'

import './style.css'

const routes = [
    { 
        path: '/:catchAll(.*)',
        name: 'Unit',
        component: Unit,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

const app = createApp(Unit)
app.use(router)
app.mount('#app')