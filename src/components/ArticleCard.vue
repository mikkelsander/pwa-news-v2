<template>

	<v-card>
		<v-layout row class="pa-3 ">
				<v-flex xs10>
					<v-avatar size="20px" class="mx-1">
						<v-img :src="`https://icon-locator.herokuapp.com/icon?url=${avatarUrl}&amp;size=50..80..100`"></v-img>
					</v-avatar>
					<span class="caption">{{ article.source.name }}</span>
				</v-flex>
				<v-flex xs2 >
					<span class="caption">{{ formattedDate }}</span>
				</v-flex>
		</v-layout>
		<v-layout row>
			<v-flex xs7>
				<v-card-title class="pt-1">
					<div>
						<div class="title">Halycon Days</div>
						<div>Ellie Goulding</div>
						<div>(2013)</div>
					</div>
				</v-card-title>
			</v-flex>
			<v-flex xs5>
				<v-img src="https://cdn.vuetifyjs.com/images/cards/halcyon.png" height="80px" contain></v-img>
			</v-flex>
		</v-layout>
		<v-divider light></v-divider>
		<v-card-actions class="pa-3">
			Rate this album
			<v-spacer></v-spacer>
			<v-icon>share</v-icon>
			<v-icon>listen</v-icon>
		
		</v-card-actions>
	</v-card>

</template>

<script>
export default {
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  computed: {
    avatarUrl() {
      return this.$store.getters.publisherUrl(this.article.source.name).url;
    },
    formattedDate() {
      return new Date(this.article.publishedAt);
    }
  },
  created() {
    const publishDate = new Date(this.article.publishedAt);
    publishDate.console.log(publishDate);
    const hours = publishDate.getUTCHours();
    console.log('hours: ' + hours);
    const minutes = publishDate.getUTCMinutes();
    console.log('minutes: ' + minutes);
    const day = publishDate.getUTCDay();
    console.log('day: ' + day);
  }
};
</script>

<style>
</style>