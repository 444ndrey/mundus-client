import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import "primevue/resources/primevue.min.css";
import "primevue/resources/themes/md-light-indigo/theme.css";
import 'primeicons/primeicons.css';
import Tooltip from 'primevue/tooltip';
import './style.css';
import router from './router.js';


const app = createApp(App)
.use(PrimeVue)
.directive('tooltip', Tooltip)
.use(router)
.mount('#app');



