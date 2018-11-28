<template>
  <v-list two-line>
    <v-text-field color="indigo" class="mx-4 mt-3" prepend-inner-icon="search" label="Search" v-model="search" solo></v-text-field>

    <v-subheader>Showing {{ filteredPublishers.length }} publishers</v-subheader>

    <div class="text-xs-center mt-5" v-if="showSpinner">
      <v-progress-circular :size="50" color="indigo" indeterminate></v-progress-circular>
    </div>
    <div v-else>
      <template v-for="publisher in filteredPublishers">
        <v-list-tile :key="publisher.id + '-item'" avatar @click="$router.push({ name: 'publisher', params: { publisher: publisher } })">
          <v-list-tile-avatar>
            <v-lazy-image :src="`https://icon-locator.herokuapp.com/icon?url=${publisher.url}&amp;size=30..70..100`"></v-lazy-image>
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>{{ publisher.name }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ publisher.category }} ({{ publisher.language }})</v-list-tile-sub-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <v-icon v-if="isSubcribed(publisher)" color="green lighten-2 ">check</v-icon>
          </v-list-tile-action>
        </v-list-tile>

        <v-divider :inset="true" :key="publisher.id + '-divider'"></v-divider>
      </template>
    </div>
  </v-list>
</template>

<script>
  import {
    fetchPublishers
  } from "@/api-service";
  import VLazyImage from "v-lazy-image";

  export default {
    data: () => ({
      publishers: [],
      publisherCount: 0,
      showSpinner: true,
      search: ""
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
      },

      subscriptions() {
        return this.$store.getters.subscriptions;
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
      },

      isSubcribed(publisher) {
        return (
          this.subscriptions.findIndex(sub => sub.publisherId == publisher.id) >
          -1
        );
      }
    },

    created() {
      console.log("created");
      this.publishers = this.getPublishers();
    },

    components: {
      VLazyImage
    }
  };
</script>