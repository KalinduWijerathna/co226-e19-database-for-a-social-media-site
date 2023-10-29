<template>
  <div class="home">
    <div class="nav-bar">
      <div class="container">
        <div class="logo">
          <img src="@/assets/logo.png" alt="">
          <h3>eraLink</h3>
        </div>
        <div class="links">
          <router-link to="/"><img src="@/assets/Home_light.png" alt=""></router-link>
          <router-link to="/find-friends"><img src="@/assets/Group_light.png" alt=""></router-link>
        </div>
        <comp-pop-menu />
      </div>
    </div>
    <router-view v-slot="{ Component }">
      <transition name="slide" mode="out-in">
        <component :is="Component"></component>
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import compPopMenu from "@/components/compPopMenu.vue";

</script>

<style scoped>
.home {
  padding-top: 4rem;
}

.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  background: white;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.151);
}

.nav-bar .container {
  height: 4rem;
  display: flex;
  align-items: center;
}

.nav-bar .logo {
  display: flex;
  align-items: baseline;
  font-size: 1.7rem;
  color: #2FA634;
}

.nav-bar .logo h3 {
  font-weight: 500;
}

.nav-bar .logo img {
  height: 2rem;
}

.links {
  margin: auto;
  display: flex;
  align-items: flex-end;
  gap: 2rem;
}

.links a {
  display: flex;
  align-items: baseline;
  border-bottom: 2px solid transparent;
  transition: 0.5s all;
}

.links a.router-link-active.router-link-exact-active {
  border-bottom: 2px solid #2FA634;
}

.links img {
  height: 2rem;
}

@media screen and (max-width: 769px) {
  .nav-bar .container {
    padding: 0 1rem;
  }

  .nav-bar .logo h3 {
    display: none;
  }

}


/* Slide from bottom transition */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}

.slide-enter

/* .slide-leave-active in <2.1.8 */
  {
  transform: translateY(100px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateY(-100px);
  opacity: 0;
}
</style>
