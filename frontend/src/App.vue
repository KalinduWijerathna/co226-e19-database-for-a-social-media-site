<template>
  <div class="app">
    <transition name="alert">
      <comp-success-alert v-if="store.state.sucList.length" :msg="store.state.sucList[0]" />
    </transition>
    <transition name="alert">
      <comp-error-alert v-if="store.state.errList.length" :msg="store.state.errList[0]" />
    </transition>
    <router-view />
    <comp-comments v-if="store.state.showComment" @close="store.commit('showComments')" />
  </div>
</template>
<script setup>
import compSuccessAlert from './components/compSuccessAlert.vue';
import CompErrorAlert from './components/compErrorAlert.vue';
import compComments from './components/compComments.vue'
import { useStore } from 'vuex';
import { ref } from 'vue';

const store = useStore()

const showComment = ref(false)
</script>

<style>
.container {
  width: clamp(300px, 90%, 1280px);
  margin: auto;
}

.flex-box {
  display: flex;
}

input[type="text"],
input[type="password"],
input[type="email"] {
  display: block;
  padding: 0.5em 1em;
  border: none;
  margin: 0.5em 0;
  background: #eef;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 300;
}

button {
  cursor: pointer;
  background: none;
  border: none;
}


.alert-enter-from,
.alert-leave-to {
  transform: translateY(-6rem);
  opacity: 0;
}

.alert-enter-active,
.alert-leave-active {
  transition: 0.2s all ease;
}

.errmsg {
  font-size: 0.8rem !important;
  text-align: left;
  color: red;
  margin: 2px 5px;
}

.back {
  display: block;
}

.back img {
  height: 25px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
  position: absolute;
}

.fade-leave-to {
  opacity: 0;
}
</style>
