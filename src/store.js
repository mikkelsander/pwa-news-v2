import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    subscriptions: {
      countries: [

      ],
      publishers: [

      ]
    },
    badges: {
      subscriptions: 0,
    }
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

    updateCountrySubscriptions(state, countries) {
      Vue.set(state.subscriptions, 'countries', countries)
    },

    removeCountrySubscription(state, country) {
      let copy = [...state.subscriptions.countries];
      if (!copy.includes(country)) return;
      const index = copy.indexOf(country);
      copy.splice(index, 1);
      Vue.set(state, 'countries', copy);

    },

    updatePublisherSubscriptions(state, publishers) {
      Vue.set(state.subscriptions, 'publishers', publishers)
    },

    removePublisherSubscription(state, publisher) {
      let copy = [...state.subscriptions.publishers];
      if (!copy.includes(publisher)) return;
      const index = copy.indexOf(publisher);
      copy.splice(index, 1);
      Vue.set(state.subscriptions, 'publishers', copy);
    },

    incrementSubscriptionsBadge(state) {
      state.badges.subscriptions++;
    },

    resetSubscriptionsBadge(state) {
      state.badges.subscriptions = 0;
    },


  },
  actions: {
    addPublisherSubscription({
      commit,
      state
    }, newSub) {
      let copy = [...state.subscriptions.publishers];
      const alreadySubscribed = copy.find(oldSub => oldSub.id === newSub.id); //undefined if not found

      if (alreadySubscribed) return;

      copy.push(newSub);
      commit('updatePublisherSubscriptions', copy)
      commit('incrementSubscriptionsBadge')
    },

    addCountrySubscription({
      commit,
      state
    }, newSub) {
      let copy = [...state.subscriptions.countries];
      const alreadySubscribed = copy.find(oldSub => oldSub.name === newSub.name); //undefined if not found

      if (alreadySubscribed) return;

      copy.push(newSub);
      commit('updateCountrySubscriptions', copy)
      commit('incrementSubscriptionsBadge')
    }
  },

});