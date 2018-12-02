import '@babel/polyfill';
require('intersection-observer');

import Vue from "vue";
import './plugins/Vuetify'
import "./registerServiceWorker";
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueClazyLoad from 'vue-clazy-load'

Vue.use(VueClazyLoad);

Vue.config.devtools = true
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
  
}).$mount("#app");