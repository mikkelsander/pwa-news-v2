<template>
	<v-card height="100%" class="pa-2">
		<v-card-title>
			<div class="subheading">Account details</div>
		</v-card-title>
		<v-divider></v-divider>
		<v-list v-if="userIsAuthenticated" class="pa-0">
			<v-subheader>Signed in as</v-subheader>
			<v-list-tile>
				<v-list-tile-content>
					<v-list-tile-title>{{ user.username }}</v-list-tile-title>
					<v-list-tile-sub-title>Username</v-list-tile-sub-title>
				</v-list-tile-content>
				<v-list-tile-action>
					<v-btn color="indigo" small ripple @click="showSignOutDialog = true">
						<span style="color: white;">Sign out</span>
					</v-btn>
				</v-list-tile-action>
			</v-list-tile>
		</v-list>
		<v-list v-else>
			<v-subheader>Currently not signed in to any account</v-subheader>
			<div class="text-xs-center">
				<v-btn color="indigo" @click="showSignInDialog = true, $refs.loginForm.reset()">
					<span style="color: white;">Log in</span>
				</v-btn>
				<span>or</span>
				<v-btn color="indigo" @click="showCreateAccountDialog = true,  $refs.createForm.reset()">
					<span style="color: white;">Sign up</span>
				</v-btn>
			</div>
		</v-list>


		<v-card-title class="mt-3">
			<div class="subheading">Active subscriptions</div>
		</v-card-title>
		<v-divider></v-divider>

		<v-list two-line>
			<v-subheader>Publishers ({{ subscriptions.length }})</v-subheader>

			<template v-for="subscription in subscriptions">
				<v-list-tile :key="subscription.publisherId + '-item'" avatar>
					<v-list-tile-avatar>
						<v-img crossorigin="anonymous" :src="`https://icon-locator.herokuapp.com/icon?url=${subscription.publisherUrl}&amp;size=30..70..100`"></v-img>
					</v-list-tile-avatar>

					<v-list-tile-content>
						<v-list-tile-title v-html="subscription.publisherName"></v-list-tile-title>
						<v-list-tile-sub-title>{{subscription.publisherCategory}}</v-list-tile-sub-title>
					</v-list-tile-content>

					<v-list-tile-action>
						<v-btn icon ripple @click="unsubscribe(subscription)">
							<v-icon color="red lighten-2">clear</v-icon>
						</v-btn>
					</v-list-tile-action>
				</v-list-tile>

				<v-divider :inset="true" :key="subscription.publisherId + '-divider'"></v-divider>
			</template>
		</v-list>

		<v-snackbar v-model="showSnackbar" top :timeout="2000">{{ snackbarMessage }}</v-snackbar>

		<v-dialog v-model="showSignOutDialog">
			<v-card>
				<v-card-title class="headline">Sign out?</v-card-title>
				<v-card-text>
					<p>You will lose locally stored data if you sign out. Continue?</p>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="indigo darken-1" flat="flat" @click="showSignOutDialog = false">no</v-btn>
					<v-btn color="indigo darken-1" flat="flat" @click="signOut()">yes</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog persistent v-model="showCreateAccountDialog">
			<v-card>
				<v-card-title class="headline pb-0">Create account</v-card-title>
				<v-card-text class="py-0">
					<v-container>
						<v-layout column>
							<v-form ref="createForm">
								<v-flex xs12>
									<v-text-field v-model="credentials.username" label="Username" :rules="userNameRules" required></v-text-field>
								</v-flex>
								<v-flex xs12>
									<v-text-field v-model="credentials.password" label="Password" :rules="passwordRules" type="password" required></v-text-field>
								</v-flex>
							</v-form>
						</v-layout>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="indigo darken-1" flat="flat" @click="showCreateAccountDialog = false">Cancel</v-btn>
					<v-btn color="indigo darken-1" flat="flat" @click="createAccount()">Create</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog persistent v-model="showSignInDialog">
			<v-card>
				<v-card-title class="headline pb-0">Log in</v-card-title>
				<v-card-text class="py-0">
					<v-container>
						<v-layout column>
							<v-form ref="loginForm">
								<v-flex xs12>
									<v-text-field v-model="credentials.username" label="Username" :rules="userNameRules" required></v-text-field>
								</v-flex>
								<v-flex xs12>
									<v-text-field v-model="credentials.password" label="Password" :rules="passwordRules" type="password" required></v-text-field>
								</v-flex>
							</v-form>
						</v-layout>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="indigo darken-1" flat="flat" @click="showSignInDialog = false">Cancel</v-btn>
					<v-btn color="indigo darken-1" flat="flat" @click="signIn()">Log in</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

	</v-card>
</template>

<script>
	import VLazyImage from "v-lazy-image";

	export default {
		data: () => ({
			credentials: {
				username: '',
				password: ''
			},
			showSignOutDialog: false,
			showCreateAccountDialog: false,
			showSignInDialog: false,
			showSnackbar: false,
			snackbarMessage: "",

			userNameRules: [
				v => !!v || 'Username is required'
			],
			passwordRules: [
				v => !!v || 'Password is required'
			],
		}),

		computed: {
			user() {
				return this.$store.state.user;
			},
			userIsAuthenticated() {
				return this.$store.state.authenticated;
			},
			subscriptions() {
				return this.$store.getters.subscriptions;
			}
		},

		methods: {

			unsubscribe(subscription) {
				console.log("unsubscribing " + subscription.publisherName);
				this.$store.dispatch("removeSubscription", subscription.publisherId);
				this.showSnackbar = true;
				this.snackbarMessage = `You are no longer subscribed to ${subscription.publisherName}`;
			},

			async getSubscriptions() {
				await this.$store.dispatch("getSubscriptions");
			},

			async createAccount() {
				if (this.$refs.createForm.validate()) {
					this.showSignInDialog = false
					await this.$store.dispatch("createUser", this.credentials);
					this.$refs.createForm.reset();
				}
			},

			async signIn() {
				if (this.$refs.loginForm.validate()) {
					this.showSignInDialog = false
					await this.$store.dispatch("authenticateUser", this.credentials);
					this.$refs.loginForm.reset();
				}
			},

			async signOut() {
				this.showSignOutDialog = false;
				await this.$store.dispatch("signOutUser");
			}
		},

		created() {
			this.getSubscriptions();
		},

		components: {
			VLazyImage
		}
	};
</script>

<style>
</style>