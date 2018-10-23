import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Discover from './components/Discover.vue';
import Publisher from './components/Publisher.vue';

Vue.use(Router);

export default new Router({
  routes: [{
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import( /* webpackChunkName: "about" */ "./views/About.vue")
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
      component: Discover
    },
    {
      path: "/settings",
      name: "settings",
      component: () =>
        import("./components/Settings.vue")
    },
    {
      path: "/publisher/:id",
      name: "publisher",
      component: Publisher,
      props: true
    },

  ]
});