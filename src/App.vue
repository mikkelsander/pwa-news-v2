<template>
  <v-app>
    <v-toolbar color app>
      <v-toolbar-title class="headline">
        <span><em>News Feed</em></span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-snackbar v-model="showOfflineSnack" top :timeout="0">
          <span>You are offline</span>
          <v-btn color="pink" flat @click="showOfflineSnack = false">
            Ok
          </v-btn>
        </v-snackbar>
      </v-toolbar-items>

    </v-toolbar>

    <v-content>
      <keep-alive>
        <router-view v-if="!isLoading" />
      </keep-alive>
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
  data: () => ({
    showOfflineSnack: false
  }),
  computed: {
    isLoading() {
      return this.$store.state.loadingState;
    }
  },
  methods: {
    updateOnlineStatus() {
      this.showOfflineSnack = !window.navigator.onLine;
    }
  },
  created() {
    window.addEventListener('online', this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);
  }
};
</script>