import '@babel/polyfill'
import Vue from "vue";
import './plugins/Vuetify'
import "./registerServiceWorker";
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import App from "./App.vue";
import router from "./router";
import store from "./store";
import {
  getSubscriptions,
  createSubscription,
  deleteSubscription,
  deleteUser,
  updateUser,
  createUser,
  getUser,
  getPublisher,
  getAllPublishers,
} from './api-service';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),

  created() {


    this.test();

  },
  methods: {
    async test() {
      // await this.$store.dispatch('authenticateUser', {
      //   username: "test123",
      //   password: "test"
      // });

      await this.$store.dispatch('setInitialState');




      // await this.$store.dispatch('deleteUser');

      // await this.$store.dispatch('authenticateUser', {
      //   username: "test123",
      //   password: "test"
      // });


      // await this.$store.dispatch('addSubscription', "buzzfeed");
      // await this.$store.dispatch('addSubscription', "abc-news");
      // await this.$store.dispatch('addSubscription', "bbc-news");
      // await this.$store.dispatch('addSubscription', "aftenposten");
      // await this.$store.dispatch('removeSubscription', "buzzfeed");


      // await getUser(token).then(res => console.log("getUser ", res));
      // await getAllPublishers().then(res => console.log("getAllPublishers ", res))
      // await getPublisher("abc-news").then(res => console.log("getPublisher ", res))
      // await getSubscriptions(token).then(res => console.log("getSubs ", res))
    }
  }

}).$mount("#app");