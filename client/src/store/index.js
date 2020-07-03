import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    alert: null,
  },
  mutations: {
    alert(state, alert) {
      state.alert = alert;
    }
  },
});
