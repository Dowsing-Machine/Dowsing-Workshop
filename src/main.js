import { createApp } from 'vue'

import { createRouter, createWebHistory  } from 'vue-router'
import routes from "./router"

import { createPinia } from 'pinia'
import { Undo } from '@/store/plugins/undo'
import { StateRecord } from '@/store/plugins/stateRecord'      
import App from './App.vue'

import VueGridLayout from 'vue-grid-layout'
import mitt from 'mitt'

const router = createRouter({
    routes,
    history: createWebHistory(),
});


const app=createApp(App);
app.use(router);
const pinia = createPinia();
pinia.use(Undo);
// pinia.use(StateRecord);

app.use(pinia);
app.use(VueGridLayout);

app.config.globalProperties.$EventBus = new mitt();
app.config.performance=true;

app.mount('#app');
