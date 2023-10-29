import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3010";

axios.defaults.headers.common["Content-Type"] = "application/json";

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
      store.commit("setLogout");
      axios.defaults.headers = "";
      store.commit("addError", "Session has expired");
      router.push("/login");
      console.log("Access denied");
      return Promise.resolve("");
    }
    return Promise.reject(error);
  }
);

createApp(App).use(store).use(router).mount("#app");
