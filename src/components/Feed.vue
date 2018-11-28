<template>
  <div>
    <v-container class="px-0 py-0">
      <v-layout column>
        <v-card class="feed-toolbar py-2">
          <v-layout row align-center>
            <v-flex xs10>
              <v-subheader class="ml-4 px-0">
                <v-menu offset-y>
                  <div slot="activator">
                    <span class="subheading text--white">{{ selectedItem.display }}</span>
                    <v-icon class="feed-icon pl-1">expand_more</v-icon>
                  </div>
                  <v-list>
                    <v-list-tile v-for="item in menuItems" :key="item.id" @click="selectedItem = item">
                      <v-list-tile-content>{{ item.display }}</v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </v-subheader>
            </v-flex>
            <!-- <v-flex xs-2>
              <v-subheader class="mr-4 px-0">
                <v-menu v-model="showCategoryMenu" :close-on-content-click="false" :nudge-width="200">
                  <div slot="activator">
                    <span class="subheading text--white">{{ selectedCategoryLabel }}</span>
                    <v-icon class="feed-icon pl-2">sort</v-icon>
                  </div>

                  <v-card>
                    <v-card-title class="subheading">Filter by category</v-card-title>
                    <v-divider></v-divider>

                    <v-card-text>
                      <v-container class="pa-0">
                        <v-layout row>
                          <v-flex xs12 class="pr-2">
                            <v-layout column>
                              <v-checkbox v-model="selectedCategory" label="Business" color="indigo" value="Business"
                                hide-details></v-checkbox>
                              <v-checkbox v-model="selectedCategory" label="Entertainment" color="indigo" value="Entertainment"
                                hide-details></v-checkbox>
                              <v-checkbox v-model="selectedCategory" label="Health" color="indigo" value="Health"
                                hide-details></v-checkbox>
                            </v-layout>
                          </v-flex>
                          <v-flex xs12>
                            <v-layout column>
                              <v-checkbox v-model="selectedCategory" label="Science" color="indigo" value="Science"
                                hide-details></v-checkbox>
                              <v-checkbox v-model="selectedCategory" label="Sports" color="indigo" value="Sports"
                                hide-details></v-checkbox>
                              <v-checkbox v-model="selectedCategory" label="Technology" color="indigo" value="Technology"
                                hide-details></v-checkbox>
                            </v-layout>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn flat @click="showCategoryMenu = false, selectedCategory = 'Category' ">Clear</v-btn>
                      <v-btn color="primary" flat @click="showCategoryMenu = false">Save</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </v-subheader>
            </v-flex> -->
          </v-layout>
        </v-card>
      </v-layout>
    </v-container>
    <v-container class="mt-5 pt-4">
      <v-layout column>
        <v-subheader class="subheading">News feed</v-subheader>
        <div class="text-xs-center mt-5" v-if="showSpinner">
          <v-progress-circular :size="50" color="indigo" indeterminate></v-progress-circular>
        </div>
        <div v-else>
          <div>
            <v-flex class="mb-2 mt-1" v-for="(article, index) in filteredList" :key="index">
              <article-card :article="article"></article-card>
            </v-flex>
          </div>
          <v-flex>
            <p class="text-xs-center mt-5 subheading mx-2" v-if="subscriptions.length < 1">
              You currently don't have any active subscriptions. Head over to the discover page and find your favorite
              publishers.
            </p>
          </v-flex>
        </div>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import ArticleCard from "./ArticleCard";
  import {
    fetchArticles
  } from "@/api-service";
  import isYesterday from "date-fns/is_yesterday";
  import isToday from "date-fns/is_today";
  import differenceInCalendarDays from "date-fns/difference_in_calendar_days";

  export default {
    components: {
      ArticleCard
    },
    data: () => ({
      title: "Feed",
      articles: [],
      articleCount: 0,
      showSpinner: false,
      showCategoryMenu: false,
      selectedCategory: null,
      selectedItem: {
        value: "all",
        display: "All news"
      },
      menuItems: [{
          value: "all",
          display: "All news"
        },
        {
          value: "today",
          display: "Today's news"
        },
        {
          value: "yesterday",
          display: "Yesterday's news"
        },
        {
          value: "older",
          display: "Older news"
        }
      ],

    }),
    computed: {

      // selectedCategoryLabel() {
      //   return this.selectedCategory != null ? this.selectedCategory : "Category";
      // },

      // filteredList() {
      //   if (this.selectedCategory != null) {
      //     return this.articles.filter(article => article.publisherCategory.toLowerCase() == this.selectedCategory.toLowerCase());
      //   }
      //   return this.articles;
      // },

      subscriptions() {
        return this.$store.getters.subscriptions;
      },
    },

    methods: {
      async getArticles() {
        try {
          const response = await fetchArticles(this.$store.state.user.authenticationToken, this.selectedItem.value,
            this.articleCount, 20);
          this.articles.push(...response.articles);
          this.articleCount += response.count;
          console.log(this.articleCount);
        } catch (error) {
          console.log(error);
        }
        this.showSpinner = false;
      },

    },

    watch: {
      selectedItem() {
        this.articles = [];
        this.articleCount = 0;
        this.showSpinner = true;
        this.getArticles();
      }
    },

    mounted() {
      this.showSpinner = true;

      if (this.subscriptions.length < 1) {
        this.showSpinner = false;
        return;
      }

      this.getArticles();

      window.onscroll = () => {
        let bottomOfWindow =
          document.documentElement.scrollTop + window.innerHeight ===
          document.documentElement.offsetHeight;

        if (bottomOfWindow) {

          this.getArticles()

        }
      };
    }
  };
</script>

<style>
  .feed-toolbar {
    position: fixed;
    width: 100%;
    z-index: 1;
  }

  .feed-icon {
    position: relative;
    top: 3px;
  }
</style>