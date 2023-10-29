import { createRouter, createWebHistory } from "vue-router";
import { useStore } from "vuex";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: {
      auth: true,
    },
    children: [
      {
        path: "",
        name: "dash",
        component: () =>
          import(/* webpackChunkName: "dash" */ "../views/main/DashView.vue"),
      },
      {
        path: "/find-friends",
        name: "friends",
        component: () =>
          import(
            /* webpackChunkName: "dash" */ "../views/main/FriendsView.vue"
          ),
      },
      {
        path: "/profile/:username",
        name: "profile",
        component: () =>
          import(
            /* webpackChunkName: "prof" */ "../views/main/ProfileView.vue"
          ),
      },
      {
        path: "/profile/edit-profile",
        name: "editprofile",
        component: () =>
          import(
            /* webpackChunkName: "editprof" */ "../views/main/EditProfileView.vue"
          ),
      },
      {
        path: "/create-post",
        name: "createPost",
        component: () =>
          import(
            /* webpackChunkName: "post" */ "../views/main/PostCreateView.vue"
          ),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/LoginView.vue"),
  },
  {
    path: "/sign-up",
    name: "signup",
    component: () =>
      import(/* webpackChunkName: "sign" */ "../views/SignView.vue"),
    children: [
      {
        name: "signup1",
        path: "",
        component: () =>
          import(
            /* webpackChunkName: "sign1" */ "../views/SignViews/SignView1.vue"
          ),
        meta: {
          index: 1,
        },
      },
      {
        name: "signup2",
        path: "more-about-you",
        component: () =>
          import(
            /* webpackChunkName: "sign2" */ "../views/SignViews/SignView2.vue"
          ),
        meta: {
          index: 2,
        },
      },
      {
        name: "signup3",
        path: "finalize",
        component: () =>
          import(
            /* webpackChunkName: "sign3" */ "../views/SignViews/SignView3.vue"
          ),
        meta: {
          index: 3,
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const store = useStore();
  const isAuthenticated = store.state.isAuthenticated;

  if (to.meta.auth && !isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router;
