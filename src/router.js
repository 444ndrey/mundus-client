import * as VueRouter from 'vue-router';

import MapPage from './pages/MapPage.vue';


const routes = [
    {path: '/', component: MapPage}
]



const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes
});


export default router;