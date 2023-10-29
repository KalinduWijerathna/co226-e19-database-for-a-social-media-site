import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    sucList: [],
    errList: [],
    isAuthenticated: false,
    token: "",
    user: Object,
    currentSignupUser: "",
    showComment: false,
    currComPost: 0,
    loading: false,
  },
  getters: {},
  mutations: {
    addSuccess(state, msg) {
      state.sucList.push(msg);
      setTimeout(() => {
        state.sucList = [];
      }, 2000);
    },
    addError(state, msg) {
      state.errList.push(msg);
      setTimeout(() => {
        state.errList = [];
      }, 2000);
    },
    setLogin(state, payload) {
      state.token = payload.token;
      state.isAuthenticated = true;
      state.user = payload.user;
      axios.defaults.headers.common["authorization"] = payload.token;
    },
    setLogout(state) {
      state.token = "";
      state.user = "";
      state.isAuthenticated = false;
      axios.defaults.headers.common["authorization"] = "";
    },
    showComments(state) {
      state.showComment = !state.showComment;
    },
  },
  actions: {
    async loadState({ commit }) {
      const stateJson = localStorage.getItem("myAppState");
      if (stateJson) {
        const state = JSON.parse(stateJson);
        commit("setLogin", {
          token: state.token,
          user: state.user,
          tokenExpiration: state.tokenExpiration,
        });
      }
    },
  },
  modules: {},
  // Subscribe to mutations to save state to localStorage
  plugins: [
    (store) => {
      store.subscribe((mutation, state) => {
        saveStateToLocalStorage(state);
      });
    },
  ],
});

// Save state to localStorage
function saveStateToLocalStorage(state) {
  localStorage.setItem("myAppState", JSON.stringify(state));
}
