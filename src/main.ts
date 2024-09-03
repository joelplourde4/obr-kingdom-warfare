import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'
import {Tabs, Tab} from 'vue3-tabs-component';
import OBR from "@owlbear-rodeo/sdk";

import './style.css'
import App from './App.vue'
import Unit from '../unit/Unit.vue'

const app = createApp(App)

const routes = [
    { 
        path: '/',
        name: 'Home',
        component: App,
    },
    { 
        path: '/unit/',
        name: 'Unit',
        component: Unit,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

app.use(router)
app.component('tabs', Tabs)
app.component('tab', Tab)
app.mount('#app')

const intervalId = window.setInterval(async () => {
    if (OBR.isReady) {
        app.provide('isGM', await OBR.player.hasPermission("MAP_CREATE"))
        clearInterval(intervalId);
    }
  }, 200);