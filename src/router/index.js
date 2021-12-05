
export default [
    {
        path: '/',
        name: 'editboard',
        component: () => import('../views/Editboard.vue'),
    },
    {
        path: '/greeting',
        name: 'greeting',
        component: () => import('../views/Greeting.vue'),
    },
    // {
    //     path: '/data_specification',
    //     name: 'data specification',
    //     component: () => import('../views/DataSpecification.vue')
    // }
];
