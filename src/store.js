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
      authenticationToken: '',
    },
    subscriptions: [],
    publishers: [],
    badges: {
      newSubsCount: 0
    },
    loadingState: true
  },

  getters: {
    subscriptions: state => {
      if (state.subscriptions.length == 0) return;
      return state.subscriptions.sort(sub => sub.publisherName);
    },
  },

  mutations: {
    setLoadingState(state, loadingState) {
      state.loadingState = loadingState;
    },

    setAuthenticationToken(state, token) {
      state.user.authenticationToken = token;
    },

    setUserId(state, id) {
      state.user.id = id;
    },

    setPublishers(state, publishers) {
      Vue.set(state, 'publishers', publishers);
    },

    setSubscriptions(state, subscriptions) {
      Vue.set(state, 'subscriptions', subscriptions);
    },

    incrementSubscriptionsBadge(state) {
      state.badges.newSubsCount++;
    },

    resetSubscriptionsBadge(state) {
      state.badges.newSubsCount = 0;
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

    async updateLocalStateUser({
      commit,
    }, user) {

      try {
        await IDBService.clearStore(IDBService.USER_STORE);
        await IDBService.addItemToStore(user, IDBService.USER_STORE);
        commit('setAuthenticationToken', user.authenticationToken);
        commit('setUserId', user.id);

      } catch (error) {
        console.log(error)
      }
    },

    async authenticateUser({
      dispatch,
    }, credentials) {

      try {
        const user = await authenticate(credentials.username, credentials.password);

        //save and keep only the last used credentials in indexed db.
        await IDBService.clearStore(IDBService.CREDENTIALS_STORE);
        await IDBService.addItemToStore(credentials, IDBService.CREDENTIALS_STORE);

        await dispatch("updateLocalStateUser", user)

      } catch (error) {
        throw Error(error)
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
      dispatch
    }, publisherId) {

      // if subscription is already in the index DB below calls will throw errors
      try {
        const subscription = await createSubscription(publisherId, state.user.authenticationToken);
        await IDBService.addItemToStore(subscription, IDBService.SUBSCRIPTIONS_STORE);
        await dispatch("syncLocalSubscriptionsState");

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