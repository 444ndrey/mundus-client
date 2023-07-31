import * as VueRouter from 'vue-router';

import MapPage from './pages/MapPage.vue';
import CountriesListPage from './pages/CountriesListPage.vue'


const routes = [
    {path: '/', component: MapPage},
    {path: '/list', component: CountriesListPage}
]



const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes
});


export default router;