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
      axios.defaults.headers.common["Authorization"] = payload.token;
    },
    setLogout(state) {
      state.token = "";
      state.user = "";
      state.isAuthenticated = false;
      axios.defaults.headers.common["Authorization"] = "";
    },
    showComments(state) {
      console.log("store");
      state.showComment = !state.showComment;
    },
  },
  actions: {},
  modules: {},
  // Load initial state from localStorage
  state: loadStateFromLocalStorage(),
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

// Retrieve state from localStorage
function loadStateFromLocalStorage() {
  const stateJson = localStorage.getItem("myAppState");
  if (stateJson) {
    const state = JSON.parse(stateJson);
    if (state.token != "") {
      axios.defaults.headers.common["Authorization"] = state.token;
    }
    state.errList = [];
    state.sucList = [];
    return state;
  } else {
    return {
      sucList: [],
      errList: [],
      isAuthenticated: false,
      token: "",
      user: Object,
      currentSignupUser: "",
    };
  }
}
