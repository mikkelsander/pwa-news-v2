<template>
  <v-app class="max-width">
    <v-toolbar color="indigo" app class="max-width">
      <v-toolbar-title>
        <span style="color: white" class="headline">PWA News</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-toolbar-items v-if="showHomeScreenButton">
        <v-btn color="white" flat small @click="addToHomeScreen()">Install app</v-btn>
      </v-toolbar-items>

      <v-toolbar-items>
        <v-snackbar v-model="showOfflineSnack" top :timeout="0">
          <span>You are offline</span>
          <v-btn color="pink" flat @click="showOfflineSnack = false">Ok</v-btn>
        </v-snackbar>
      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <div class="initial-load" v-if="isLoading">
        <div class="loading-spinner">
          <v-progress-circular :size="50" color="indigo" indeterminate></v-progress-circular>
        </div>
        <div class="text-xs-center mt-4 subheading">Server is booting. Please wait..</div>
      </div>
      
    
    <transition name="fade-page">
      <keep-alive>
        <router-view v-if="!isLoading"/>
      </keep-alive>
    </transition>

    </v-content>

    <v-bottom-nav class=".v-bottom-nav max-width" app fixed :active.sync="bottomNav" :value="true">
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
          <v-icon>settings</v-icon>
        </v-badge>
      </v-btn>
    </v-bottom-nav>
  </v-app>
</template>

<script>
import { fetchPublishers } from '@/api-service';

export default {
  name: "App",

  data: () => ({
    bottomNav: "",
    showOfflineSnack: false,
    showHomeScreenButton: false,
    deferredPrompt: null,
    isLoading: false,
  }),

  computed: {
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
    },

    async setInitialState() {
      this.isLoading = true;
      await this.$store.dispatch('setInitialState');
      console.log("sending empty request to boot server")
      await fetchPublishers(); //send request to boot server on start up. Done in order to display "long loading time message"
      this.isLoading = false;
    },
   
  },
  created() {
    this.bottomNav = this.$route.name;
    this.setInitialState();

    window.addEventListener("online", this.updateOnlineStatus);
    window.addEventListener("offline", this.updateOnlineStatus);

    window.addEventListener("beforeinstallprompt", e => {
      this.showHomeScreenButton = true;
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
    });
  },
}
</script>

<style>
.fade-page-enter-active  {
  transition-property: opacity;
  transition-duration: 0.2s;
  transition-timing-function: ease-in;
}

.fade-page-enter-active {
  transition-delay: 0.12s
}

.fade-page-leave-active {
  transition-duration: 0.12s;
   transition-property: opacity;
  transition-timing-function: ease-in;
}

.fade-page-enter, .fade-leave-active {
  opacity: 0
}


.fade-item-enter-active  {
  transition-property: opacity;
  transition-duration: 0.5s;
  transition-timing-function: ease-in;
}

.fade-item-enter-active {
  transition-delay: 0.1s
}

.fade-item-leave-active {
  transition-duration: 0.5s;
   transition-property: opacity;
  transition-timing-function: ease-in;
}

.fade-item-enter, .fade-item-leave-active {
  opacity: 0
}

.initial-load {
  position: relative;
  margin: 0 auto;
  /* width: 250px; */
  top: 30vh;
}

.initial-load > .loading-spinner {
  position: relative;
  margin: 0 auto;
  width: 50px;
  /* top: 200px; */
}

.max-width {
  max-width: 768px;
}

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