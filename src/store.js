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
      var user = await IDBService.getAllItemsFromStore(IDBService.USER_STORE);

      if(user[0] == undefined) {
        commit('setLoadingState', false);
        return; 
      }

      commit('setUser', user[0]);
      console.log("user", state.user)
      commit('setAuthenticated', true);
      
      try {    
        await dispatch("getSubscriptions", state.user.authenticationToken);
        console.log("subs", state.subscriptions)

      } catch (error) {    
        console.log(error)
        
      } finally {
        commit('setLoadingState', false);
      }
    },

    async authenticateUser({
      commit,
      dispatch,
    }, credentials) {

      try {
        const user = await authenticate(credentials.username, credentials.password);

        await IDBService.clearStore(IDBService.USER_STORE);
        await IDBService.addItemToStore(user, IDBService.USER_STORE);

        commit('setUser', user);
        commit('setAuthenticated', true);

        await dispatch('getSubscriptions')

      } catch (error) {
        console.log(error)
      }
    },

    async signOutUser({
      commit,
    }) {

      try {
        await IDBService.clearStore(IDBService.USER_STORE);
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
      dispatch,
      state
    }) {
      try {
        await deleteUser(state.user.authenticationToken);
        dispatch("signOutUser")
        
      } catch (error) {
        console.log("error", error)
      }
    },

    async getSubscriptions({
      state,
      commit,
    }) {

      try {
        const subscriptions = (await fetchSubscriptions(state.user.authenticationToken)).subscriptions;
        commit("setSubscriptions", subscriptions);

      } catch (error) {
        console.log(error)
      }
    },

    async addSubscription({
      state,
      commit,
    }, subscription) {

      let copy = [...state.subscriptions];
      
      const subscriptionExists = copy.find(sub => sub.publisherId == subscription.publisherId);
      if(subscriptionExists) return;

      copy.push(subscription);
      commit("setSubscriptions", copy)
      commit("incrementSubscriptionsBadge");

      try {      
        await createSubscription(subscription.publisherId, state.user.authenticationToken);

      } catch (error) {
        console.log("error", error)
      }
    },

    async removeSubscription({
      state,
      commit,
    }, publisherId) {

      let copy = [...state.subscriptions];

      let subscription = copy.find(sub => sub.publisherId == publisherId);
      if(subscription == undefined) return;
      
      let index = copy.indexOf(subscription);
      copy.splice(index, 1);

      commit("setSubscriptions", copy)

      try {
        await deleteSubscription(publisherId, state.user.authenticationToken);

      } catch (error) {
        console.log("error", error)
      }
    },

  }
});