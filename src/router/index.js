import Editboard from "../views/Editboard.vue";


export default [
    {
        path: '/',
        name: 'editboard',
        component: Editboard
    },
    {
        path: '/greeting',
        name: 'greeting',
        // component: () => import('../views/Greeting.vue'),
    },
    // {
    //     path: '/data_specification',
    //     name: 'data specification',
    //     component: () => import('../views/DataSpecification.vue')
    // }
];
