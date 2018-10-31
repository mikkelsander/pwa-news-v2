<template>
    <v-card>
        <v-card-title>
            <div class="headline">Active subscriptions</div>
        </v-card-title>

        <v-list two-line>

            <v-subheader>
                Publishers ({{ publishers.length }})
            </v-subheader>

            <template v-for="publisher in publishers">

                <v-list-tile :key="publisher.id + '-item'" avatar>
                    <v-list-tile-avatar>
                        <v-img crossorigin="anonymous" :src="`https://icon-locator.herokuapp.com/icon?url=${publisher.url}&amp;size=70..120..200`"></v-img>
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                        <v-list-tile-title v-html="publisher.name"></v-list-tile-title>
                              <v-list-tile-sub-title> <strong>Weekly</strong> </v-list-tile-sub-title>
                    </v-list-tile-content>


                    <v-list-tile-action>
                        <v-btn icon ripple @click="unsubscribe(publisher)">
                            <v-icon color="grey lighten-1">clear</v-icon>
                        </v-btn>
                    </v-list-tile-action>

                </v-list-tile>

                <v-divider :inset="true" :key="publisher.id + '-divider'"></v-divider>

            </template>


            <v-subheader class="mt-4">
                Countries ({{ countries.length }})
            </v-subheader>

            <template v-for="country in countries">


                <v-list-tile :key="country.name + '-item'" avatar>
                    <v-list-tile-avatar>
                        <v-img :src="require(`../assets/countries/flags/${country.code.toLowerCase()}.svg`)"></v-img>
                    </v-list-tile-avatar>


                    <v-list-tile-content>
                        <v-list-tile-title v-html="country.name"></v-list-tile-title>
                        <v-list-tile-sub-title> <strong>Weekly</strong>  </v-list-tile-sub-title>
                        <v-list-tile-sub-title> General, Sports, Science, Technology,´Health, Politics, History </v-list-tile-sub-title>
                      
                    </v-list-tile-content>

                    
                    <v-list-tile-action>
                        <v-btn icon ripple>
                            <v-icon color="grey lighten-1">edit</v-icon>
                        </v-btn>
                    </v-list-tile-action>
<!--                     
                    <v-list-tile-action>
                        <v-btn icon ripple>
                            <v-icon color="grey lighten-1">clear</v-icon>
                        </v-btn>
                    </v-list-tile-action> -->


                </v-list-tile>
                <v-divider :inset="true" :key="country.name + '-divider'"></v-divider>
            </template>

        </v-list>

    <v-snackbar v-model="showSnackbar" top :timeout="2000">
      {{ snackbarMessage }}
    </v-snackbar>

    </v-card>

</template>

<script>
export default {
  data: () => ({
    showSnackbar: false,
    snackbarMessage: ''
  }),

  computed: {
    publishers() {
      console.log('getting pub subs');
      return this.$store.getters.publisherSubscriptions;
    },
    countries() {
      console.log('getting country subs');
      return this.$store.getters.countrySubscriptions;
    }
  },

  methods: {
    unsubscribe(publisher) {
      console.log('unsubscribing ' + publisher.name);
      this.$store.commit('removePublisherSubscription', publisher);
      this.showSnackbar = true;
      this.snackbarMessage = `You are no longer subscribed to ${publisher.name}`;
    }
  }
};
</script>

<style>
</style>