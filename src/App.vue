<template>
  <v-app>
    <v-toolbar color app>
      <v-toolbar-title class="headline">
        <span><em>News Feed</em></span>
      </v-toolbar-title>

      <v-spacer></v-spacer>
    </v-toolbar>

    <v-content>
      <router-view v-if="!isLoading" />
    </v-content>

    <bottom-navigation></bottom-navigation>

  </v-app>
</template>

<script>
import BottomNavigation from './components/BottomNavigation.vue';

export default {
  name: 'App',
  components: {
    BottomNavigation
  },
  computed: {
    isLoading() {
      return this.$store.state.loadingState;
    }
  }
};
</script>