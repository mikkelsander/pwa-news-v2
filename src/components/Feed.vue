<template>
  <div>
    <v-card class="feed-toolbar max-width">
      <v-toolbar :z-index="1"  card color="white">
        <v-spacer></v-spacer>

        <v-subheader>
          <v-menu :z-index="2" offset-y>
            <div slot="activator">
              <span class="subheading">{{ selectedItem.display }}</span>
              <v-icon class="feed-icon pl-1">expand_more</v-icon>
            </div>
            <v-list>
              <v-list-tile v-for="item in menuItems" :key="item.id" @click="selectedItem = item">
                <v-list-tile-content>{{ item.display }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-subheader>
        <!-- <v-spacer></v-spacer> -->
        <!-- <v-toolbar-items>             
            <v-btn icon disabled>
              <span class="text-capitalize">more</span>
              <v-icon color="grey">more_vert</v-icon>
            </v-btn>     
        </v-toolbar-items> -->
      </v-toolbar>
    </v-card>
      <v-container class="pt-5">
        <v-layout column>
          <v-subheader class="subheading mt-3">News feed</v-subheader>
          <div class="text-xs-center mt-5" v-if="showSpinner">
            <v-progress-circular :size="50" color="indigo" indeterminate></v-progress-circular>
          </div>
          <div v-else>
            <div>
              <v-flex class="mb-2 mt-1" v-for="(article, index) in articles" :key="index">
                <article-card :article="article"></article-card>
              </v-flex>
            </div>
            <v-flex>
              <p class="text-xs-center mt-5 subheading mx-2" v-if="subscriptions.length < 1">
                You currently don't have any active subscriptions. Head over to the discover page and find your
                favorite
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

  export default {
    components: {
      ArticleCard,
    },
    data: () => ({
      title: "Feed",
      articles: [],
      articleCount: 0,
      showSpinner: false,
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
      subscriptions() {
        return this.$store.getters.subscriptions;
      },
    },

    methods: {
      async getFirstBatchOfArticles() {
        try {
          const response = await fetchArticles(this.$store.state.user.authenticationToken, this.selectedItem.value,
            0, 20);
          this.articles = response.articles;
          this.articleCount = response.count;
        } catch (error) {
          console.log(error);
        }
        this.showSpinner = false;
      },

      async getNextBatchOfArticles() {
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
        this.getFirstBatchOfArticles();
      }
    },

    activated() {
      this.getFirstBatchOfArticles();
    },

    created() {
      this.showSpinner = true;

      if (this.subscriptions.length < 1) {
        this.showSpinner = false;
        return;
      }

      this.getFirstBatchOfArticles();

      window.onscroll = () => {
        let bottomOfWindow =
          document.documentElement.scrollTop + window.innerHeight ===
          document.documentElement.offsetHeight;

        if (bottomOfWindow) {

          this.getNextBatchOfArticles()

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