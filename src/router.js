import Vue from "vue";
import Router from "vue-router";
import Feed from './components/Feed.vue'
import Discover from './components/Discover.vue';
import Publisher from './components/Publisher.vue';
import Account from './components/Account.vue';

Vue.use(Router);

export default new Router({
  routes: [{
      path: "/",
      redirect: "/feed"
    },
    {
      path: "/feed",
      name: "feed",
      component: Feed
    },
    {
      path: "/discover",
      name: "discover",
      component: Discover
    },
    {
      path: "/account",
      name: "account",
      component: Account
    },
    {
      path: "/publisher/:id",
      name: "publisher",
      component: Publisher,
      props: true
    },

  ]
});