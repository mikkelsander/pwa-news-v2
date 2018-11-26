<template>

  <v-list two-line>

    <v-text-field color="indigo" class="mx-4 mt-3" prepend-inner-icon="search" label="Search" v-model="search" solo></v-text-field>
    
      <v-subheader>
        Showing {{ filteredPublishers.length }} publishers
      </v-subheader>

    <template v-for="publisher in filteredPublishers">

      <v-list-tile :key="publisher.id + '-item'" avatar @click="$router.push({ name: 'publisher', params: { publisher: publisher } })">
        <v-list-tile-avatar>
          <v-lazy-image :src="`https://icon-locator.herokuapp.com/icon?url=${publisher.url}&amp;size=30..70..150`"></v-lazy-image>
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
import VLazyImage from 'v-lazy-image';

export default {
  data: () => ({
    publishers: [],
    publisherCount: 0,
    showSpinner: true,
    search: ''
  }),

  computed: {
    filteredPublishers() {
      let result = this.publishers;

      if (this.search) {
        result = this.publishers.filter(
          p => p.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
        );
      }

      return result;
    }
  },

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
  },

  components: {
    VLazyImage
  }
};
</script>