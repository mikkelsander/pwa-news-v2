<template>
	<div>
		<v-card class="px-3 pt-3 pb-0">
			<div @click="expand = !expand">
				<v-layout row class="pb-3">
					<v-flex xs7>
						<v-avatar size="20px" class="mr-1">
							<v-img crossorigin="anonymous" :src="avatarUrl"></v-img>
						</v-avatar>
						<span class="caption">{{ article.source.name }}</span>
					</v-flex>
					<v-flex xs5>
						<div class="timestamp">{{ distanceInWordsToNow(new Date(article.publishedAt)) }} ago</div>
					</v-flex>
				</v-layout>
				<v-layout row class="pb-3">
					<v-flex xs8>
						<v-card-title class="pa-0 pr-3">
							<div>
								<div class="subheading">{{ article.title }}</div>
							</div>
						</v-card-title>
					</v-flex>
					<v-flex xs4>
						<v-img crossorigin="anonymous" :src="imageUrl" height="90px" width="100%"></v-img>
					</v-flex>
				</v-layout>
			</div>

			<v-slide-y-transition>
				<v-layout>
					<v-flex>
						<v-divider light></v-divider>
						<v-card-actions v-show="expand">
							<span class="caption">Full article</span>
							<v-btn icon :href="article.url">
								<v-icon>link</v-icon>
							</v-btn>
							<v-spacer></v-spacer>
							<span class="caption">Listen</span>
							<v-btn icon>
								<v-icon>play_circle_outline</v-icon>
							</v-btn>
						</v-card-actions>
					</v-flex>
				</v-layout>

			</v-slide-y-transition>

		</v-card>
	</div>
</template>

<script>
import { distanceInWordsToNow } from 'date-fns';

export default {
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    expand: false,
    distanceInWordsToNow
  }),
  computed: {
    avatarUrl() {
      const url = this.$store.getters.publisherUrl(this.article.source.name).url;
      return `https://icon-locator.herokuapp.com/icon?url=${url}&amp;size=50..80..100`;
    },
    imageUrl() {
      return this.article.urlToImage != null ? this.article.urlToImage : this.avatarUrl;
    }
  }
};
</script>

<style>
img {
  max-width: 100%;
}

.timestamp {
  font-size: 10px;
  text-align: end;
}
</style>