
export default [
    {
        path: '/',
        name: 'editboard',
        component: () => import('../views/Editboard.vue'),
    },
    {
        path: '/greeting',
        name: 'greeting',
        component: () => import('../views/greeting.vue'),
    },
];
