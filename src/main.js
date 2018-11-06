import '@babel/polyfill';
require('intersection-observer');
import Vue from "vue";
import './plugins/vuetify'
import "./registerServiceWorker";
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),

  created() {
    this.$store.dispatch('setInitialState');
  }

}).$mount("#app");