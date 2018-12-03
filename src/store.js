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
  },

  getters: {
    subscriptions: state => {
      if (state.subscriptions == undefined) return [];
      return state.subscriptions.sort((a, b) => a.publisherName.localeCompare(b.publisherName));
    },
  },

  mutations: {
    setAuthenticated(state, bool) {
      state.authenticated = bool
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

      IDBService.openConnection();
      var user = await IDBService.getAllItemsFromStore(IDBService.USER_STORE);

      if(user[0] == undefined) {
        return; 
      }
      
      commit('setUser', user[0]);
      console.log("user", state.user)
      commit('setAuthenticated', true);

      var subscriptions = await IDBService.getAllItemsFromStore(IDBService.SUBSCRIPTIONS_STORE);
      commit('setSubscriptions', subscriptions)
  
      try {    
        await dispatch("getSubscriptions", state.user.authenticationToken);
        console.log("subs", state.subscriptions)

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

        await IDBService.clearStore(IDBService.SUBSCRIPTIONS_STORE);
        for(let subscription of subscriptions) {
          await IDBService.addItemToStore(subscription, IDBService.SUBSCRIPTIONS_STORE)
        }

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
      await IDBService.addItemToStore(subscription, IDBService.SUBSCRIPTIONS_STORE)

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
      await IDBService.deleteItemFromStore(publisherId, IDBService.SUBSCRIPTIONS_STORE);
      
      try {
        await deleteSubscription(publisherId, state.user.authenticationToken);

      } catch (error) {
        console.log("error", error)
      }
    },

  }
});