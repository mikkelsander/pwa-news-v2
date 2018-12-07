<template>
	<div>
		<v-card	 class="px-3 pt-3 pb-2">
			<div @click="expand = !expand">
				<v-layout row class="pb-3">
					<v-flex xs7>
						<v-avatar size="20px" class="mr-1">
							<vue-clazy-load :src="avatarUrl">
								<img :src="avatarUrl">
								<div class="preloader" slot="placeholder">
									<v-progress-circular :size="10" :width="1" color="indigo" indeterminate></v-progress-circular>
								</div>
							</vue-clazy-load>
						</v-avatar>
						<span class="publisher-name caption">{{ article.publisherName }}</span>
					</v-flex>
					<v-flex xs5>
						<div class="timestamp">{{ distanceInWordsToNow(new Date(article.publishedAt)) }} ago</div>
					</v-flex>
				</v-layout>
				<v-layout row class="pb-2">
					<v-flex xs8>
						<v-card-title class="pa-0 pr-3">
							<div>
								<div class="subheading">{{ article.title }}</div>
							</div>
						</v-card-title>
					</v-flex>
					<v-flex xs4>
						<vue-clazy-load class="article-image" :src="imageUrl">
								<img :src="imageUrl">
								<div class="preloader" slot="placeholder">
									<div style="width: 30px; height: 30px; margin: 0 auto">
										<v-progress-circular :size="30" :width="2" color="indigo" indeterminate></v-progress-circular>
									</div>									
								</div>
						</vue-clazy-load>
					</v-flex>
				</v-layout>
			</div>

			<v-slide-y-transition>
				<v-layout v-show="expand">
					<v-flex>
						<div class="body-1 font-weight-light font-italic pb-2" v-if="article.description != null" @click="expand = !expand">{{ article.description }}</div>
						<v-divider light></v-divider>
						<v-card-actions class="pb-0">
							<v-spacer></v-spacer>
							<span class="caption">Link to article</span>
							<v-btn icon :href="article.url">
								<v-icon color="">link</v-icon>
							</v-btn>
							<!-- <span class="caption ml-2">Add to list</span>
							<v-btn disabled icon>
								<v-icon color="grey">playlist_add</v-icon>
							</v-btn> -->
						</v-card-actions>
					</v-flex>
				</v-layout>

			</v-slide-y-transition>

		</v-card>
	</div>
</template>

<script>
  import { VueClazyLoad } from 'vue-clazy-load'
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
		VueClazyLoad
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

.publisher-name {
	position: relative;
  top: -2px;
}
</style>