<template>
  <v-layout row>
    <v-flex xs12 sm10 offset-sm1>
      <v-card>
        <v-card flat>
          <v-img
            contain
            height="320px"
            :src="`https://icon-locator.herokuapp.com/icon?url=${publisher.url}&amp;size=100..300..400`"
          ></v-img>

          <v-btn id="fab" color="indigo" absolute fab bottom right :class="{'green lighten-2': isSubscribed}" @click="subscribe()">
            <v-icon color="white" v-if="isSubscribed">check</v-icon>
            <v-icon color="white" v-else>add</v-icon>
          </v-btn>
        </v-card>

        <v-card-title class="title">{{ publisher.name }}</v-card-title>

        <v-card-text class="pt-0">
          <div>
            <em>{{ publisher.description }}</em>
          </div>
        </v-card-text>

        <v-list two-line>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon color="indigo">label</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ publisher.category }}</v-list-tile-title>
              <v-list-tile-sub-title>category</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-action>
              <v-icon color="indigo">link</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ publisher.url }}</v-list-tile-title>
              <v-list-tile-sub-title>website</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-action>
              <v-icon color="indigo">location_on</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ publisher.country }}</v-list-tile-title>
              <v-list-tile-sub-title>country</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>

    <v-snackbar v-model="showSnackbar" top :timeout="2000">
      <div class="text-xs-center">Subscribing to top headlines from {{ publisher.name }}</div>
    </v-snackbar>
  </v-layout>
</template>

<script>
export default {
  props: {
    publisher: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    dialog: false,
    showSnackbar: false
  }),

  computed: {
    isSubscribed() {
      return this.$store.getters.subscriptions.findIndex(sub => sub.publisherId == this.publisher.id) > -1       
    }
  },

  methods: {
    subscribe() {
      if(this.isSubscribed) return;
      console.log("subscribing to " + this.publisher.name);
      const subscription = {
        publisherId: this.publisher.id,
        publisherName: this.publisher.name,
        publisherCategory: this.publisherCategory
      }
      this.$store.dispatch("addSubscription", subscription);
      this.showSnackbar = true;
    }
  }
};
</script>

<style>

</style>