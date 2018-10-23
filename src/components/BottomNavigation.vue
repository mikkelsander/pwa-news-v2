<template>
    <v-bottom-nav class=".v-botton-nav" app fixed :active.sync="bottomNav" :value="true">

      <v-btn color="indigo" flat value="Feed" to="/feed">
        <span>Feed</span>
        <v-icon>rss_feed</v-icon>
      </v-btn>

      <v-btn color="indigo" flat value="Discover" to="/discover">
        <span>Discover</span>
        <v-icon>search</v-icon>
      </v-btn>

      <v-btn color="indigo" flat value="Subscriptions" to="/subscriptions" @click="resetSubscriptionBadge()">
        <span>Subscriptions</span>
        <v-badge right color="red" :value="subscriptionsBadge > 0">
          <span slot="badge">{{ subscriptionsBadge }}</span>
          <v-icon>settings</v-icon>
        </v-badge>
      </v-btn>

    </v-bottom-nav>
</template>

<script>
export default {
  data() {
    return {
      bottomNav: 'Feed'
    };
  },
  computed: {
    subscriptionsBadge() {
      return this.$store.state.badges.subscriptions;
    }
  },
  methods: {
      resetSubscriptionBadge() {
          this.$store.commit('resetSubscriptionsBadge');
      }
  },
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
