<template>
	<v-card>
		<v-list two-line>

			<v-subheader>
				Showing 128 publishers
			</v-subheader>
			<template v-for="publisher in publishers">

				<v-list-tile :key="publisher.id + '-item'" avatar @click="$router.push({ name: 'publisher', params: { publisher: publisher } })">
					<v-list-tile-avatar>
						<v-img :src="`https://icon-locator.herokuapp.com/icon?url=${publisher.url}&amp;size=70..120..200`"></v-img>
					</v-list-tile-avatar>

					<v-list-tile-content>
						<v-list-tile-title v-html="publisher.name"></v-list-tile-title>
						<v-list-tile-sub-title v-html="publisher.category"></v-list-tile-sub-title>
					</v-list-tile-content>

					<v-list-tile-action>
						<!-- <v-list-tile-action-text>{{publisher}}}</v-list-tile-action-text> -->
						
					</v-list-tile-action>

				</v-list-tile>

				<v-divider :inset="true" :key="publisher.id + '-divider'"></v-divider>

			</template>
		</v-list>
	</v-card>
</template>

<script>
export default {
  data: () => ({
    publishers: []
  }),

  created() {
    const mockPublishers = [
      {
        category: 'general',
        country: 'us',
        description:
          'This is a description. Lorem Ipsum I need this text to be longer, so i looks better. Mikkel is a sexy motherfucker',
        id: 'abc-news',
        language: 'en',
        name: 'ABC News',
        url: 'https://abcnews.go.com'
      },
      {
        category: 'general',
        country: 'au',
        description:
          "Australia's most trusted source of local, national and world news. Comprehensive, independent, in-depth analysis, the latest business, sport, weather and more.",
        id: 'abc-news-au',
        language: 'en',
        name: 'ABC News (AU)',
        url: 'http://www.abc.net.au/news'
      },
      {
        category: 'general',
        country: 'no',
        description:
          'Norges ledende nettavis med alltid oppdaterte nyheter innenfor innenriks, utenriks, sport og kultur.',
        id: 'aftenposten',
        language: 'no',
        name: 'Aftenposten',
        url: 'https://www.aftenposten.no'
      },
      {
        category: 'general',
        country: 'us',
        description:
          'News, analysis from the Middle East and worldwide, multimedia and interactives, opinions, documentaries, podcasts, long reads and broadcast schedule.',
        id: 'al-jazeera-english',
        language: 'en',
        name: 'Al Jazeera English',
        url: 'http://www.aljazeera.com'
      },
      {
        category: 'general',
        country: 'it',
        description:
          'Agenzia ANSA: ultime notizie, foto, video e approfondimenti su: cronaca, politica, economia, regioni, mondo, sport, calcio, cultura e tecnologia.',
        id: 'ansa',
        language: 'it',
        name: 'ANSA.it',
        url: 'http://www.ansa.it'
      },
      {
        category: 'business',
        country: 'sa',
        description:
          'ارقام موقع متخصص في متابعة سوق الأسهم السعودي تداول - تاسي - مع تغطيه معمقة لشركات واسعار ومنتجات البتروكيماويات , تقارير مالية الاكتتابات الجديده ',
        id: 'argaam',
        language: 'ar',
        name: 'Argaam',
        url: 'http://www.argaam.com'
      },
      {
        category: 'technology',
        country: 'us',
        description:
          "The PC enthusiast's resource. Power users and the tools they love, without computing religion.",
        id: 'ars-technica',
        language: 'en',
        name: 'Ars Technica',
        url: 'http://arstechnica.com'
      }
    ];

    this.publishers = mockPublishers;
  }
};
</script>

<style>
.grid {
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  grid-gap: 10px;
}

v-img {
  opacity: 0.5;
}
</style>