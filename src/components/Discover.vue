<template>
  <v-container fill-height>
    <v-layout>
      <v-flex>
        <v-card height="100%" class="xs-12">
          <publisher-list></publisher-list>
        </v-card>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import PublisherList from './PublisherList';

export default {
  components: {
    PublisherList
  },
  data: () => ({
    title: 'Discover'
  })
};
</script>

<style>
</style>