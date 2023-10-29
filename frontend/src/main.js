import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import axios from "axios";

axios.defaults.baseURL = "https://peralink-backend.onrender.com";

axios.defaults.headers.common["content-type"] = "application/json";
axios.defaults.headers.common["Authorization"] = "";

axios.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response;
  },
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      router.currentRoute.value.path !== "/login"
    ) {
      console.log(store.state);
      store.commit("setLogout");
      store.commit("addError", "Session has expired");
      router.push("/login");
      console.log("Access denied");
      return Promise.resolve("");
    }
    return Promise.reject(error);
  }
);

store.dispatch("loadState").then(() => {
  createApp(App).use(store).use(router).mount("#app");
});
