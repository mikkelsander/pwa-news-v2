<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline">
        <span>Vuetify</span>

      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-content>
      <router-view />
    </v-content>
    <v-bottom-nav :active.sync="bottomNav" :value="true" absolute color="transparent">

      <v-btn color="teal" flat value="recent">
        <span>Feed</span>
        <v-icon>rss_feed</v-icon>
      </v-btn>

      <v-btn color="teal" flat value="favorites">
        <span>Discover</span>
        <v-icon>search</v-icon>
      </v-btn>

      <v-btn color="teal" flat value="nearby">
        <span>Settings</span>
        <v-icon>settings</v-icon>
      </v-btn>

    </v-bottom-nav>

  </v-app>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        bottomNav: 'Feed'
      }
    }
  }
</script>