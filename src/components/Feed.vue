<template>
<v-container>
  <v-layout column> 
    <v-subheader>
      Today's news
    </v-subheader>
    <v-flex class="mb-2" v-for="(article, index)  in sortedArticles" :key="index">
      <article-card :article="article"> </article-card>
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
    articles: []
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
      let fetchedArticles = [];

      if (this.publisherSubscriptions.length < 1) return;

      for (const publisher of this.publisherSubscriptions) {
        fetchedArticles.push(...(await getHeadlinesFromPublisher(publisher.id)));
      }

      this.articles = fetchedArticles;
    }
  },

  mounted() {
    this.getArticles();
  }
};
</script>

<style>
</style>
