<template>
    <v-card>
        <v-card-title class="title">
            Active subscriptions
        </v-card-title>

        <v-list two-line>

            <v-subheader>
                Publishers ({{ publishers.length }})
            </v-subheader>

            <template v-for="publisher in publishers">

                <v-list-tile :key="publisher.id + '-item'" avatar>
                    <v-list-tile-avatar>
                        <v-img :src="`https://icon-locator.herokuapp.com/icon?url=${publisher.url}&amp;size=70..120..200`"></v-img>
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
    </v-card>
</template>


<script>
import countryList from '../assets/countries/country-list.json';

export default {
  data: () => ({
    countries: []
  }),

  computed: {
    publishers() {
      console.log('getting subscriptions');
      return this.$store.getters.publisherSubscriptions;
    }
  },

  created() {
    const mockPublishers = [
      {
        category: 'general',
        country: 'us',
        description:
          'This is a description. Lorem Ipsum I need this text to be longer, so i looks better. Mikkel is a sexy motherfucker',
        id: 'abc-news',
        language: 'en',
        name: 'ABC News',
        url: 'https://abcnews.go.com'
      },
      {
        category: 'general',
        country: 'au',
        description:
          "Australia's most trusted source of local, national and world news. Comprehensive, independent, in-depth analysis, the latest business, sport, weather and more.",
        id: 'abc-news-au',
        language: 'en',
        name: 'ABC News (AU)',
        url: 'http://www.abc.net.au/news'
      },
      {
        category: 'general',
        country: 'no',
        description:
          'Norges ledende nettavis med alltid oppdaterte nyheter innenfor innenriks, utenriks, sport og kultur.',
        id: 'aftenposten',
        language: 'no',
        name: 'Aftenposten',
        url: 'https://www.aftenposten.no'
      }
    ];

    this.countries = countryList.countries;
  },

  methods: {
    unsubscribe(publisher) {
      console.log('unsubscribing ' + publisher.name);
      this.$store.commit('removePublisherSubscription', publisher);
    }
  }
};
</script>

<style>
</style>