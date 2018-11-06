<template>
  <v-app>
    <v-toolbar color app>
      <v-toolbar-title class="headline">
        <span>
          <em>News Feed</em>
        </span>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <!-- <v-toolbar-side-icon class="pr-4">
        <span class="caption">Filter</span>
        <v-icon small class="pl-2">sort</v-icon>
      </v-toolbar-side-icon> -->
        <v-toolbar-items v-if="showHomeScreenButton">
          <v-btn flat small @click="addToHomeScreen()">Add to homescreen</v-btn>
        </v-toolbar-items>

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
    BottomNavigation,
  },
  data: () => ({
    showOfflineSnack: false,
    showHomeScreenButton: false,
    deferredPrompt: null,
  }),
  computed: {
    isLoading() {
      return this.$store.state.loadingState;
    },
  },
  methods: {
    updateOnlineStatus() {
      this.showOfflineSnack = !window.navigator.onLine;
    },

    addToHomeScreen() {
      this.showHomeScreenButton = false;
      // Show the prompt
      this.deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      this.deferredPrompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        this.deferredPrompt = null;
      });
    },
  },
  created() {
    window.addEventListener('online', this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);

    window.addEventListener('beforeinstallprompt', e => {
      this.showHomeScreenButton = true;
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
    });
  },
};
</script>