import Vue from 'vue';
import Vuex from 'vuex';
import IndexDbService from '@/idb-service';

const subscriptionStore = 'subscriptions';
const IDBService = new IndexDbService();

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    subscriptions: {
      countries: [],
      publishers: []
    },
    badges: {
      subscriptions: 0
    },
    loadingState: true
  },
  getters: {
    countrySubscriptions: state => {
      return state.subscriptions.countries.sort(country => country.name);
    },

    publisherSubscriptions: state => {
      return state.subscriptions.publishers.sort(publisher => publisher.name);
    },

    publisherUrl: state => name => {
      return state.subscriptions.publishers.find(publisher => publisher.name === name);
    }
  },

  mutations: {

    setLoadingState(state, loadingState) {
      state.loadingState = loadingState;
    },

    updatePublisherSubscriptions(state, publishers) {
      Vue.set(state.subscriptions, 'publishers', publishers);
    },

    incrementSubscriptionsBadge(state) {
      state.badges.subscriptions++;
    },

    resetSubscriptionsBadge(state) {
      state.badges.subscriptions = 0;
    }
  },

  actions: {
    setInitialState({
      commit
    }) {

      commit('setLoadingState', true);

      IDBService.openConnection();

      IDBService.getAllItemsFromStore(subscriptionStore).then(subscriptions => {
        commit('updatePublisherSubscriptions', subscriptions);
        commit('setLoadingState', false);
      });
    },

    addPublisherSubscription({
      commit,
      state
    }, subscription) {
      let copy = [...state.subscriptions.publishers];
      const alreadySubscribed = copy.find(oldSub => oldSub.id === subscription.id); //undefined if not found

      if (alreadySubscribed) return;

      copy.push(subscription);
      commit('updatePublisherSubscriptions', copy);
      commit('incrementSubscriptionsBadge');

      IDBService.addItemToStore(subscription, subscriptionStore);
    },

    deletePublisherSubscription({
      commit,
      state
    }, subscription) {
      let copy = [...state.subscriptions.publishers];
      const notSubscribed = !copy.includes(subscription);

      if (notSubscribed) return;

      const index = copy.indexOf(subscription);
      copy.splice(index, 1);
      commit('updatePublisherSubscriptions', copy);

      IDBService.deleteItemFromStore(subscription.id, subscriptionStore);
    }
  }
});