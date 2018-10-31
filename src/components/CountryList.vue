<template>
	<v-card>

		<v-list>
			<v-subheader>
				Showing 54 countries
			</v-subheader>

			<template v-for="country in countries">


				<v-list-tile :key="country.name + '-item'" avatar>
					<v-list-tile-avatar>
						<v-img crossorigin="anonymous" :src="require(`../assets/countries/flags/${country.code.toLowerCase()}.svg`)"></v-img>
					</v-list-tile-avatar>


					<v-list-tile-content>
						<v-list-tile-title v-html="country.name"></v-list-tile-title>
					</v-list-tile-content>

					<v-list-tile-action>
						<v-btn icon ripple  @click="subscribe(country)">
							<v-icon>add</v-icon>
						</v-btn>
					</v-list-tile-action>

				</v-list-tile>
				<v-divider :inset="true" :key="country.name + '-divider'"></v-divider>
			</template>
		</v-list>

		<v-snackbar v-model="showSnackbar" top :timeout="2000">
			<div>
				{{ snackbarMessage }}
			</div>
		</v-snackbar>

	</v-card>
</template>

<script>
import countryList from '../assets/countries/country-list.json';

export default {
  data: () => ({
    countries: [],
    showSnackbar: false,
    snackbarMessage: ''
  }),

  methods: {
    subscribe(country) {
      console.log('subscribing to ' + country.name);
      this.$store.dispatch('addCountrySubscription', country);
      this.snackbarMessage = `Subscribing to top headlines from ${country.name}`;
      this.showSnackbar = true;
    }
  },

  created() {
    this.countries = countryList.countries;
  }
};
</script>

<style>
</style>