<template>
<v-container>
  <v-layout column> 
    <v-flex class="mb-2" v-for="(article, index)  in articles" :key="index">
      <article-card :article="article"> </article-card>
    </v-flex>
  </v-layout>


</v-container>
</template>

<script>
import { getHeadlinesFromPublishers } from '@/news-service';
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
      return this.$store.getters.publisherSubscriptionsIdList;
    }
  },
  methods: {
    async getArticles() {
      if (this.publisherSubscriptions.length < 1) return;
      this.articles = await getHeadlinesFromPublishers(this.publisherSubscriptions);
    }
  },
  mounted() {
    this.getArticles();
  }
};
</script>

<style>
</style>
