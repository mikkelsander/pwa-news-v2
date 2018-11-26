<template>
	<div>
		<v-card class="px-3 pt-3 pb-0">
			<div @click="expand = !expand">
				<v-layout row class="pb-3">
					<v-flex xs7>
						<v-avatar size="20px" class="mr-1">
							<v-lazy-image :src="avatarUrl"></v-lazy-image>
						</v-avatar>
						<span class="caption">{{ article.publisherName }}</span>
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
						<v-lazy-image class="article-image" :src="imageUrl" ></v-lazy-image>
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
import VLazyImage from 'v-lazy-image';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';

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
      return `https://icon-locator.herokuapp.com/icon?url=${
        this.article.publisherUrl
      }&amp;size=30..70..100`;
    },
    imageUrl() {
      return this.article.urlToImage != null ? this.article.urlToImage : this.avatarUrl;
    }
  },
  components: {
    VLazyImage
  }
};
</script>

<style>
article-image {
  height: 90px;
  width: 100%;
}

img {
  max-width: 100%;
}

.timestamp {
  font-size: 10px;
  text-align: end;
}
</style>