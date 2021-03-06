<template>
  <v-container fill-height>
    <v-card height="100%" width="100%" class="xs-12">
      <v-list two-line>
        <v-layout column>
          <v-subheader class="subheading">Browse popular news channels</v-subheader>

          <v-flex xs-12>
            <v-text-field color="indigo" class="mt-3 mx-3" clearable prepend-inner-icon="search" label="Search"
              v-model="search" solo></v-text-field>
          </v-flex>

          <v-flex xs-12>
            <v-select :z-index="1" v-model="selectedCategory" color="indigo" solo class="mx-3 mt-1" label="Category"
              prepend-inner-icon="filter" clearable :items="categories"></v-select>
          </v-flex>
        </v-layout>
        
        <v-subheader>Showing {{ filteredPublishers.length }} publishers</v-subheader>
        
        <div class="text-xs-center mt-5" v-if="showSpinner">
          <v-progress-circular :size="50" color="indigo" indeterminate></v-progress-circular>
        </div>
        <div v-else>
          <template v-for="publisher in filteredPublishers">
            <v-list-tile ripple :key="publisher.id + '-item'" avatar @click="$router.push({ name: 'Publisher', params: { id: publisher.id, publisher: publisher } })">
              <v-list-tile-avatar>
                <vue-clazy-load :src="`https://icon-locator.herokuapp.com/icon?url=${publisher.url}&amp;size=30..70..100`">
                  <img :src="`https://icon-locator.herokuapp.com/icon?url=${publisher.url}&amp;size=30..70..100`">
                  <div class="preloader" slot="placeholder">
                    <v-progress-circular :size="20" :width="2" color="indigo" indeterminate></v-progress-circular>
                  </div>
                </vue-clazy-load>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>{{ publisher.name }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ publisher.category }} ({{ publisher.language }})</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-icon v-if="isSubcribed(publisher)" color="green lighten-2">check</v-icon>
              </v-list-tile-action>
            </v-list-tile>

            <v-divider :inset="true" :key="publisher.id + '-divider'"></v-divider>
          </template>
        </div>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
  import {
    fetchPublishers
  } from "@/api-service";
  import {
    VueClazyLoad
  } from 'vue-clazy-load'

  export default {
    data: () => ({
      publishers: [],
      publisherCount: 0,
      showSpinner: true,
      search: "",
      selectedCategory: "",
      categories: [
        "Business",
        "Entertainment",
        "General",
        "Health",
        "Science",
        "Sports",
        "Technology"
      ],
    }),

    computed: {
      filteredPublishers() {
        let result = this.publishers;

        if (this.search) {
          result = this.publishers.filter(
            publisher => publisher.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
          );
        }

        if (this.selectedCategory) {
          result = result.filter(publisher => publisher.category.toLowerCase() == this.selectedCategory.toLowerCase())
        }

        return result;
      },

      subscriptions() {
        return this.$store.getters.subscriptions;
      },

    },

    watch: {
      showChip() {
        if (!this.showChip) {
          this.selectedCategory = "";
        }
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
      },
    },

    // activated() {
    //   this.getPublishers();
    // },
    created() {
      this.getPublishers();
    },

    components: {
      VueClazyLoad
    }
  };
</script>