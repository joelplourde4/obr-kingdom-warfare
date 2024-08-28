import { createApp } from 'vue'
import {Tabs, Tab} from 'vue3-tabs-component';
import OBR from "@owlbear-rodeo/sdk";

import './style.css'
import App from './App.vue'

const app = createApp(App)

app.component('tabs', Tabs)
app.component('tab', Tab)
app.mount('#app')

const intervalId = window.setInterval(async () => {
    if (OBR.isReady) {
        app.provide('isGM', await OBR.player.hasPermission("MAP_CREATE"))
        clearInterval(intervalId);
    }
  }, 200);