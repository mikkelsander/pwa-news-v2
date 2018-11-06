<template>
  <v-container fill-height>
    <v-layout>
      <v-flex>
        <v-card height="100%" class="xs-12">
          <publisher-list></publisher-list>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- <v-text-field class="mx-3 mt-3" label="Search" prepend-inner-icon="search" solo></v-text-field> -->


    <!-- <v-tabs v-model="tabs" centered grow color="transparent" slider-color="indigo">
      <v-tab>
          <span>Publishers</span>
      </v-tab>
      <v-tab>
          <span>Countries</span>
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tabs">
      <v-tab-item>
      </v-tab-item>
      <v-tab-item>
        <country-list></country-list>
      </v-tab-item>
    </v-tabs-items> -->
  </v-container>
</template>

<script>
import CountryList from './CountryList';
import PublisherList from './PublisherList';

export default {
  components: {
    CountryList,
    PublisherList,
  },
  data: () => ({
    title: 'Discover',
    tabs: null,
    tabNames: ['Publishers', 'Countries'],
  }),
};
</script>

<style>
</style>