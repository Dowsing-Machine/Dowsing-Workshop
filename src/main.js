import { createApp } from 'vue'

import { createRouter, createWebHistory  } from 'vue-router'
import routes from "./router"

import { createPinia } from 'pinia'

import App from './App.vue'


const router = createRouter({
    routes,
    history: createWebHistory(),
});

const app=createApp(App);
app.use(router);
app.use(createPinia());

app.mount('#app');
