import Vue from "vue";
import Router from "vue-router";
import Feed from './components/Feed.vue'
import Discover from './components/Discover.vue';
import Publisher from './components/Publisher.vue';
import Subscriptions from './components/Subscriptions.vue'

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
      path: "/subscriptions",
      name: "subscriptions",
      component: Subscriptions
    },
    {
      path: "/publisher/:id",
      name: "publisher",
      component: Publisher,
      props: true
    },

  ]
});