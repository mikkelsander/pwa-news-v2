<template>
<v-card>

		<v-list>
				<v-subheader>
					Showing 54 countries
				</v-subheader>

			<template v-for="country in countries">


				<v-list-tile :key="country.name + '-item'" avatar>
					<v-list-tile-avatar>
						<v-img :src="require(`../assets/countries/flags/${country.code.toLowerCase()}.svg`)"></v-img>
					</v-list-tile-avatar>
					

					<v-list-tile-content>
						<v-list-tile-title v-html="country.name"></v-list-tile-title>
					</v-list-tile-content>

				</v-list-tile>
				<v-divider :inset="true" :key="country.name + '-divider'"></v-divider>
			</template>
		</v-list>
</v-card>
</template>

<script>
import countryList from '../assets/countries/country-list.json';

export default {
  data: () => ({
    countries: []
  }),

  created() {
    this.countries = countryList.countries;
  }
};
</script>

<style>
</style>