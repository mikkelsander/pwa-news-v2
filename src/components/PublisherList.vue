<template>

    <v-list two-line>

      <v-text-field class="mx-3 mt-3" label="Not working" prepend-inner-icon="search" solo></v-text-field>

      <v-subheader>
        Showing {{ publisherCount }} publishers
      </v-subheader>

      <div class="text-xs-center mt-5" v-if="showSpinner">
        <v-progress-circular :size="50" color="indigo" indeterminate></v-progress-circular>
      </div>

      <template v-for="publisher in publishers" v-else>

        <v-list-tile :key="publisher.id + '-item'" avatar @click="$router.push({ name: 'publisher', params: { publisher: publisher } })">
          <v-list-tile-avatar>
            <v-img :src="`https://icon-locator.herokuapp.com/icon?url=${publisher.url}&amp;size=70..120..200`"></v-img>
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title v-html="publisher.name"></v-list-tile-title>
            <v-list-tile-sub-title v-html="publisher.category"></v-list-tile-sub-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <!-- <v-list-tile-action-text>{{publisher}}}</v-list-tile-action-text> -->

          </v-list-tile-action>

        </v-list-tile>

        <v-divider :inset="true" :key="publisher.id + '-divider'"></v-divider>

      </template>
    </v-list>

</template>

<script>
import { fetchPublishers } from '@/api-service';

export default {
  data: () => ({
    publishers: [],
    publisherCount: 0,
    showSpinner: true
  }),

  methods: {
    async getPublishers() {
      this.showSpinner = true;

      try {
        const response = await fetchPublishers();
        this.publishers = response.publishers;
        this.publisherCount = response.count;
      } catch (error) {
        console.log(error);
      } finally {
        this.showSpinner = false;
      }
    }
  },

  created() {
    console.log('created');
    this.publishers = this.getPublishers();
  }
};
</script>