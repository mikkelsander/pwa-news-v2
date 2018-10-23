<template>
  <v-app>
    <v-toolbar color app>
      <v-toolbar-title class="headline">
        <span>News App</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>
    </v-toolbar>

    <v-content>
      <router-view />
    </v-content>

    <v-bottom-nav app fixed :active.sync="bottomNav" :value="true">

      <v-btn color="teal" flat value="Feed" to="/feed">
        <span>Feed</span>
        <v-icon>rss_feed</v-icon>
      </v-btn>

      <v-btn color="teal" flat value="Discover" to="/discover">
        <span>Discover</span>
        <v-icon>search</v-icon>
      </v-btn>

      <v-btn color="teal" flat value="Settings" to="/settings">
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
    };
  }
};
</script>