import Vue from "vue";
import Router from "vue-router";
import Discover from './components/Discover.vue';
import Publisher from './components/Publisher.vue';

Vue.use(Router);

export default new Router({
  routes: [{
      path: "/",
      redirect: "/feed"
    },
    {
      path: "/feed",
      name: "feed",

      component: () =>
        import("./components/Feed.vue")
    },
    {
      path: "/discover",
      name: "discover",
      component: () =>
        import("./components/Discover.vue")
    },
    {
      path: "/subscriptions",
      name: "subscriptions",
      component: () =>
        import("./components/Subscriptions.vue")
    },
    {
      path: "/publisher/:id",
      name: "publisher",
      component: () =>
        import("./components/Publisher.vue"),
      props: true
    },

  ]
});