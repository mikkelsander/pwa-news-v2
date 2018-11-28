<template>
  <v-app>
    <v-toolbar color="indigo" app>
      <v-toolbar-title>
        <span style="color: white" class="headline">PWA News</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-toolbar-items v-if="showHomeScreenButton">
        <v-btn flat small @click="addToHomeScreen()">Add to homescreen</v-btn>
      </v-toolbar-items>

      <v-toolbar-items>
        <v-snackbar v-model="showOfflineSnack" top :timeout="0">
          <span>You are offline</span>
          <v-btn color="pink" flat @click="showOfflineSnack = false">Ok</v-btn>
        </v-snackbar>
      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <router-view v-if="!isLoading"/>
    </v-content>

    <v-bottom-nav class=".v-bottom-nav" app fixed :active.sync="bottomNav" :value="true">
      <v-btn color="indigo" flat value="Feed" to="/feed">
        <span>Feed</span>
        <v-icon>rss_feed</v-icon>
      </v-btn>

      <v-btn color="indigo" flat value="Discover" to="/discover">
        <span>Discover</span>
        <v-icon>search</v-icon>
      </v-btn>

      <v-btn color="indigo" flat value="Account" to="/account" @click="resetSubscriptionBadge()">
        <span>Account</span>
        <v-badge right color="red" :value="subscriptionsBadge > 0">
          <span slot="badge">{{ subscriptionsBadge }}</span>
          <v-icon>person</v-icon>
        </v-badge>
      </v-btn>
    </v-bottom-nav>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    bottomNav: "Feed",
    showOfflineSnack: false,
    showHomeScreenButton: false,
    deferredPrompt: null
  }),
  computed: {
    isLoading() {
      return this.$store.state.loadingState;
    },
    subscriptionsBadge() {
      return this.$store.state.badges.newSubscriptionsCount;
    }
  },
  methods: {
    updateOnlineStatus() {
      this.showOfflineSnack = !window.navigator.onLine;
    },

    resetSubscriptionBadge() {
      this.$store.commit("resetSubscriptionsBadge");
    },

    addToHomeScreen() {
      this.showHomeScreenButton = false;
      // Show the prompt
      this.deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      this.deferredPrompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        this.deferredPrompt = null;
      });
    }
  },
  created() {
    window.addEventListener("online", this.updateOnlineStatus);
    window.addEventListener("offline", this.updateOnlineStatus);

    window.addEventListener("beforeinstallprompt", e => {
      this.showHomeScreenButton = true;
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
    });
  }
};
</script>

<style>
.v-badge__badge {
  font-size: 10px;
  height: 15px !important;
  width: 15px !important;
  top: -4px !important;
  right: -4px !important;
}

.v-item-group.v-bottom-nav .v-btn:not(.v-btn--active) {
  filter: none;
  opacity: 1;
}

.v-bottom-nav .v-btn:not(.v-btn--active) i,
.v-bottom-nav .v-btn:not(.v-btn--active) span:first-child {
  filter: grayscale(100%);
  opacity: 0.5;
}

.v-bottom-nav .v-btn:not(.v-btn--active) .v-badge__badge span {
  filter: none;
  opacity: 1;
}
</style>