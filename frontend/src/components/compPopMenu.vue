<template>
    <div>
        <div class="close" @click="toggleMenu" v-if="showMenu"></div>
        <div class="pop-menu">
            <button class="profile" @click="toggleMenu">
                <img :src="user.profile_picture" alt="">
                <h3 class="pc">{{ user.first_name }} {{ user.last_name }}</h3>
            </button>
            <transition name="fade">
                <div v-if="showMenu" class="menu">
                    <h3 class="mobile">{{ user.first_name }} {{ user.last_name }}</h3>
                    <p>@{{ user.user_name }}</p>
                    <router-link :to="`/profile/${store.state.user.user_name}`" class="btn" @click="toggleMenu">
                        View Profile
                    </router-link>
                    <button class="btn logout" @click="logout">Log out</button>
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup>
import { computed, onUpdated, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore()
const router = useRouter()

const user = computed(() => {
    return store.state.user
})

const showMenu = ref(false)
const toggleMenu = () => {
    showMenu.value = !showMenu.value
}

const logout = () => {
    store.commit("setLogout")
    router.push("/login")
}

onUpdated(() => {
    user.value = store.state.user
})
</script>

<style scoped>
.pop-menu {
    position: relative;
}

.close {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    z-index: -1;
    background: #00000033;
}

.profile {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.profile img {
    height: 2.5rem;
    width: 2.5rem;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #2FA634;
}

.menu {
    position: absolute;
    top: 3rem;
    right: 0;
    min-width: 200px;
    background: white;
    box-shadow: 0 0 5px #33333333;
    padding: 1rem;
    border-radius: 15px;
}

.menu h3 {
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.menu p {
    font-weight: 200;
    font-size: 0.8rem;
}

.menu .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    width: 100%;
    background: #2FA634;
    margin-top: 1rem;
    color: white;
    text-decoration: none;
}

.pc {
    display: block;
}

.mobile {
    display: none;
}

.menu .logout {
    font-size: 1rem;
    background: #e7530e;
    margin-top: 7px;
}

@media screen and (max-width:769px) {
    .pc {
        display: none;
    }

    .mobile {
        display: block;
    }
}
</style>