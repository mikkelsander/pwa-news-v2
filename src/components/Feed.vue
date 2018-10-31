<template>
  <v-container>
    <v-layout column>
      <v-subheader>
        Today's news
      </v-subheader>
      <div class="text-xs-center mt-5" v-if="showSpinner">
        <v-progress-circular :size="50" color="indigo" indeterminate></v-progress-circular>
      </div>
        <v-flex class="mb-2" v-for="(article, index)  in sortedArticles" :key="index" v-else>
          <article-card :article="article"> </article-card>
        </v-flex>
        <v-flex>
          <p class="text-xs-center mt-5 subheading mx-2" v-if="publisherSubscriptions.length < 1">You currently don't have any active subscriptions. Head over to the discover page and find your favorite publishers.</p>
        </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import compareDesc from 'date-fns/compare_desc';
import { getHeadlinesFromPublisher } from '@/news-service';

import ArticleCard from './ArticleCard';

export default {
  components: {
    ArticleCard
  },
  data: () => ({
    title: 'Feed',
    articles: [],
    showSpinner: true
  }),
  computed: {
    publisherSubscriptions() {
      return this.$store.getters.publisherSubscriptions;
    },

    sortedArticles() {
      return this.articles.sort((a, b) =>
        compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
      );
    }
  },

  methods: {
    async getArticles() {
      this.showSpinner = true;

      let fetchedArticles = [];

      if (this.publisherSubscriptions.length < 1) {
        this.showSpinner = false;
        return;
      }

      for (const publisher of this.publisherSubscriptions) {
        try {
          fetchedArticles.push(...(await getHeadlinesFromPublisher(publisher.id)));
        } catch (e) {
          console.log(e);
        } finally {
          continue;
        }
      }

      this.articles = fetchedArticles;
      this.showSpinner = false;
    }
  },

  mounted() {
    this.getArticles();
  }
};
</script>

<style>
</style>