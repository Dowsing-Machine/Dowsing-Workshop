import { createApp } from 'vue'

import { createRouter, createWebHistory  } from 'vue-router'
import routes from "./router"

import { createPinia } from 'pinia'
import { ViewUndo } from '@/store/plugins/undo'      
import App from './App.vue'

const router = createRouter({
    routes,
    history: createWebHistory(),
});


const app=createApp(App);
app.use(router);
const pinia = createPinia();
pinia.use(ViewUndo);


app.use(pinia);

app.mount('#app');
