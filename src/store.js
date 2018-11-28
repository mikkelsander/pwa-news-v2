import Vue from 'vue';
import Vuex from 'vuex';
import IndexDbService from '@/idb-service';
import {
  authenticate,
  deleteUser,
  createUser,
  fetchSubscriptions,
  createSubscription,
  deleteSubscription
} from '@/api-service';

const IDBService = new IndexDbService();

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      id: '',
      username: '',
      authenticationToken: '',
    },
    subscriptions: [],
    badges: {
      newSubscriptionsCount: 0
    },
    authenticated: false,
    loadingState: true
  },

  getters: {
    subscriptions: state => {
      if (state.subscriptions == undefined) return [];
      return state.subscriptions.sort(sub => sub.publisherName);
    },
  },

  mutations: {
    setAuthenticated(state, bool) {
      state.authenticated = bool
    },

    setLoadingState(state, bool) {
      state.loadingState = bool;
    },

    setUser(state, user) {
      state.user = user;
    },

    resetUser(state) {
      state.user.id = '',
        state.user.username = '',
        state.user.authenticationToken = ''
    },

    setSubscriptions(state, subscriptions) {
      Vue.set(state, 'subscriptions', subscriptions);
    },

    incrementSubscriptionsBadge(state) {
      state.badges.newSubscriptionsCount++;
    },

    resetSubscriptionsBadge(state) {
      state.badges.newSubscriptionsCount = 0;
    }
  },

  actions: {
    async setInitialState({
      commit,
      state,
      dispatch
    }) {
      console.log("SETTING INITIAL STATE")
      commit('setLoadingState', true);

      IDBService.openConnection();

      console.log("getting credentials from IDB", credentials)
      var credentials = await IDBService.getAllItemsFromStore(IDBService.CREDENTIALS_STORE);

      try {
        await dispatch('authenticateUser', credentials[0]);
        console.log("user", state.user)

        await dispatch("getSubscriptions", state.user.authenticationToken);
        console.log("subs", state.subscriptions)

      } catch (error) {
        console.log(error)

      } finally {
        commit('setLoadingState', false);
      }
    },

    async updateLocalUserState({
      commit,
    }, user) {

      try {
        await IDBService.clearStore(IDBService.USER_STORE);
        await IDBService.addItemToStore(user, IDBService.USER_STORE);
        commit('setUser', user);

      } catch (error) {
        console.log(error)
      }
    },

    async authenticateUser({
      commit,
      dispatch,
    }, credentials) {

      try {
        const user = await authenticate(credentials.username, credentials.password);

        //save and keep only the last used credentials in indexed db.
        await IDBService.clearStore(IDBService.CREDENTIALS_STORE);
        await IDBService.addItemToStore(credentials, IDBService.CREDENTIALS_STORE);
        await dispatch("updateLocalUserState", user)
        commit('setAuthenticated', true);
        await dispatch('getSubscriptions')

      } catch (error) {
        throw Error(error)
      }
    },

    async signOutUser({
      commit,
    }) {
      try {
        await IDBService.clearStore(IDBService.CREDENTIALS_STORE);
        await IDBService.clearStore(IDBService.USER_STORE);
        await IDBService.clearStore(IDBService.SUBSCRIPTIONS_STORE);
        commit("resetUser");
        commit("setSubscriptions", []);
        commit("setAuthenticated", false)
        commit("resetSubscriptionsBadge");
      } catch (error) {
        console.log(error)
      }
    },

    async createUser({
      dispatch,
    }, credentials) {
      try {

        await createUser(credentials.username, credentials.password);
        await dispatch("authenticateUser", credentials)

      } catch (error) {
        console.log("error", error)
      }
    },

    async deleteUser({
      commit,
      state
    }) {
      try {

        await deleteUser(state.user.authenticationToken);

        IDBService.clearStore(IDBService.USER_STORE);
        commit('setAuthenticationToken', '');
        commit('setUserId', '');

      } catch (error) {
        console.log("error", error)
      }
    },

    async getSubscriptions({
      state,
      dispatch
    }) {
      try {

        const subscriptions = (await fetchSubscriptions(state.user.authenticationToken)).subscriptions;

        await IDBService.clearStore(IDBService.SUBSCRIPTIONS_STORE);

        for (let subscription of subscriptions) {
          await IDBService.addItemToStore(subscription, IDBService.SUBSCRIPTIONS_STORE);
        }

        await dispatch("syncLocalSubscriptionsState");

      } catch (error) {
        throw Error(error)
      }
    },

    async addSubscription({
      state,
      commit,
      dispatch
    }, publisherId) {

      // if subscription is already in the index DB below calls will throw errors
      try {
        const subscription = await createSubscription(publisherId, state.user.authenticationToken);
        await IDBService.addItemToStore(subscription, IDBService.SUBSCRIPTIONS_STORE);
        await dispatch("syncLocalSubscriptionsState");
        commit("incrementSubscriptionsBadge");

      } catch (error) {
        console.log("error", error)
      }
    },

    async removeSubscription({
      state,
      dispatch
    }, publisherId) {

      const subscription = await IDBService.getItemFromStore(publisherId, IDBService.SUBSCRIPTIONS_STORE);

      // if subscription is not in the index DB below calls will throw errors
      try {

        await deleteSubscription(subscription.publisherId, state.user.authenticationToken);
        await IDBService.deleteItemFromStore(subscription.publisherId, IDBService.SUBSCRIPTIONS_STORE);
        await dispatch("syncLocalSubscriptionsState");

      } catch (error) {
        console.log("error", error)
      }
    },

    async syncLocalSubscriptionsState({
      commit,
    }) {
      try {
        const subscriptions = await IDBService.getAllItemsFromStore(IDBService.SUBSCRIPTIONS_STORE);
        console.log("syncing subscriptions", subscriptions);
        commit("setSubscriptions", subscriptions)
      } catch (error) {
        console.log(error)
      }
    }
  }
});