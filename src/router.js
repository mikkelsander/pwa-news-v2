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
      name: "Feed",
      component: Feed
    },
    {
      path: "/discover",
      name: "Discover",
      component: Discover
    },
    {
      path: "/account",
      name: "Account",
      component: Account
    },
    {
      path: "/publisher/:id",
      name: "Publisher",
      component: Publisher,
      props: true
    },

  ]
});