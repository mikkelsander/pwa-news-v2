<template>

	<v-card height="100%">
		<v-card-title class="pb-0">
			<div class="subheading pb-0">Active subscriptions</div>
		</v-card-title>

		<v-list two-line>

			<v-subheader>
				Publishers ({{ subscriptions.length }})
			</v-subheader>

			<template v-for="subscription in subscriptions">

				<v-list-tile :key="subscription.publisherId + '-item'" avatar>
					<v-list-tile-avatar>
						<v-img crossorigin="anonymous" :src="`https://icon-locator.herokuapp.com/icon?url=${subscription.publisherUrl}&amp;size=70..120..200`"></v-img>
					</v-list-tile-avatar>

					<v-list-tile-content>
						<v-list-tile-title v-html="subscription.publisherName"></v-list-tile-title>
						<v-list-tile-sub-title> {{subscription.publisherCategory}} </v-list-tile-sub-title>
					</v-list-tile-content>


					<v-list-tile-action>
						<v-btn icon ripple @click="unsubscribe(subscription)">
							<v-icon color="grey lighten-1">clear</v-icon>
						</v-btn>
					</v-list-tile-action>

				</v-list-tile>

				<v-divider :inset="true" :key="subscription.publisherId + '-divider'"></v-divider>

			</template>

		</v-list>

		<v-snackbar v-model="showSnackbar" top :timeout="2000">
			{{ snackbarMessage }}
		</v-snackbar>

	</v-card>

</template>

<script>
export default {
  data: () => ({
    showSnackbar: false,
    snackbarMessage: ''
  }),

  computed: {
    subscriptions() {
      return this.$store.getters.subscriptions;
    }
  },

  methods: {
    unsubscribe(subscription) {
      console.log('unsubscribing ' + subscription.publisherName);
      this.$store.dispatch('removeSubscription', subscription.publisherId);
      this.showSnackbar = true;
      this.snackbarMessage = `You are no longer subscribed to ${subscription.publisherName}`;
    }
  }
};
</script>

<style>
</style>