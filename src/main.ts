import App from './App.vue';
import router from '@/router';
import store from '@/store';
import 'amfe-flexible';
import 'vant/lib/index.css';
import '@/styles/index.less';

const app = createApp(App);

app.use(router);
app.use(store);

app.mount('#app');
