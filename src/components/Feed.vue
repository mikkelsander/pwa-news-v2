<template>
  <v-container>
    <v-layout column>
      <v-subheader>
        Today's news
      </v-subheader>
      <div class="text-xs-center mt-5" v-if="showSpinner">
        <v-progress-circular :size="50" color="indigo" indeterminate></v-progress-circular>
      </div>
        <v-flex class="mb-2" v-for="(article, index) in articles" :key="index" v-else>
          <article-card :article="article"> </article-card>
        </v-flex>
        <v-flex>
          <p class="text-xs-center mt-5 subheading mx-2" v-if="subscriptions.length < 1">You currently don't have any active subscriptions. Head over to the discover page and find your favorite publishers.</p>
        </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import compareDesc from 'date-fns/compare_desc';
import { getHeadlinesFromPublisher } from '@/news-service';
import { fetchArticles } from '@/api-service';

import ArticleCard from './ArticleCard';

export default {
  components: {
    ArticleCard
  },
  data: () => ({
    title: 'Feed',
    articles: [],
    articleCount: 0,
    showSpinner: true
  }),
  computed: {
    subscriptions() {
      return this.$store.getters.subscriptions;
    }

    // sortedArticles() {
    //   return this.articles.sort((a, b) =>
    //     compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
    //   );
    // }
  },

  methods: {
    async getArticles() {
      this.showSpinner = true;
      if (this.subscriptions.length < 1) {
        this.showSpinner = false;
        return;
      }

      try {
        const response = await fetchArticles(this.$store.state.user.authenticationToken);
        this.articles = response.articles;
        this.articleCount = response.count;
      } catch (error) {
        console.log(error);
      } finally {
        this.showSpinner = false;
      }
    }
  },

  mounted() {
    this.getArticles();
  }
};
</script>

<style>
</style>