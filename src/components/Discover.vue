<template>
  <v-container>

    <v-text-field class="mx-3 mt-3" label="Search" prepend-inner-icon="search" solo></v-text-field>

    <v-tabs v-model="tabs" centered grow color="transparent" slider-color="black">
      <v-tab v-for="name in tabNames" :key="name">
        {{ name }} 
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tabs">
      <v-tab-item>
        <publisher-list></publisher-list>
      </v-tab-item>
      <v-tab-item>
        <country-list></country-list>
      </v-tab-item>
    </v-tabs-items>

  </v-container>
</template>

<script>
import CountryList from './CountryList';
import PublisherList from './PublisherList';

export default {
  components: {
    CountryList,
    PublisherList
  },
  data: () => ({
    title: 'Discover',
    tabs: null,
    tabNames: ['Publishers', 'Countries'],
    text:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  })
};
</script>

<style>
</style>