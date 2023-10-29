<template>
    <div class="profile">
        <div class="left">
            <router-link class="back" to="/find-friends"><img src="../../assets/Arrow_left.png" alt=""></router-link>
            <img class="prof-pic" :src="profile.profile_picture" alt="">
            <h4>{{ profile.first_name }} {{ profile.last_name }}</h4>
            <p class="uname">@{{ profile.user_name }}</p>
            <button class="request" v-if="!profile.is_friend && (store.state.user.user_name != route.params.username)"
                @click="">Send Request</button>
            <button class="reject" v-else-if="profile.is_friend && (store.state.user.user_name != route.params.username)"
                @click="">Unfriend</button>
            <router-link to="/profile/edit-profile" class="request"
                v-else-if="store.state.user.user_name == route.params.username">Edit
                profile</router-link>
            <ul>
                <li><img src="@/assets/Message_light.png" alt="">{{ profile.email || "not set" }}</li>
                <li v-if="profile.sex"><img src="@/assets/man.png" alt=""> Male</li>
                <li v-else><img src="@/assets/woman.png" alt="">Female</li>
                <li><img src="@/assets/birthday-cake.png" alt="">{{ dob || "not set" }}</li>
                <li><img src="@/assets/pin.png" alt="">{{ profile.location || "not set" }}</li>
                <li><img src="@/assets/suitcase.png" alt="">{{ profile.affiliation || "not set" }}</li>
                <p style="margin-block: 2rem 4rem;">{{ profile.bio }}</p>
            </ul>
        </div>
        <div class="right">
            <div class="post-deck">
                <comp-post v-for="post in posts" :key="post.id" :post="post" />
                <p style="color:#555" v-if="posts.length == 0">nothing to show here</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from "axios";
import { computed, onMounted, onUpdated, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import compPost from "@/components/compPost.vue";

const route = useRoute()
const store = useStore()
const username = computed(() => {
    return route.params.username ? route.params.username : username.value
})
const profile = ref({})
const posts = ref([])

const dob = computed(() => {
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    return `${profile.value.b_date} ${months[profile.value.b_month - 1]} ${profile.value.b_year}`;
})

const getProfile = async () => {
    try {
        const res = await axios.get(`/profile/${username.value}`)
        return res.data
    }
    catch (err) {
        store.commit("addError", err.response.data.message)
    }
}

const getPosts = async (id) => {
    try {
        const result = await axios.get(`/post_feed/profile/${id}`);
        return result.data
    }
    catch (err) {
        console.log(err)
    }
}

onMounted(async () => {
    profile.value = await getProfile()
    posts.value = await getPosts(profile.value.u_id)
})

watch(username, async () => {
    profile.value = await getProfile()
    posts.value = await getPosts(profile.value.u_id)
})
</script>

<style scoped>
.left {
    position: fixed;
    left: 0;
    width: 40%;
    height: 100vh;
    padding: 3rem 2rem;
    overflow-y: scroll;
}

.left .prof-pic {
    height: 200px;
    width: 200px;
    border-radius: 50%;
    object-fit: cover;
    border: 5px solid #15E630;
}

.left h4 {
    font-size: 1.5rem;
    margin-top: 1rem;
    font-weight: 500;
}

.left .uname {
    margin-top: 5px;
    font-weight: 500;
    color: #029432;
}

.left ul {
    margin: 1.5rem 0;
}

.left ul li {
    display: grid;
    grid-template-columns: 30px auto;
    margin: 15px 0;
}

.left ul li img {
    width: 20px;
}

.right {
    position: absolute;
    right: 0;
    width: 60%;
    background: #ddd;
    min-height: 90vh;
}

.post-deck {
    max-width: 500px;
    padding: 2rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin: auto;
}

.request,
.reject {
    display: block;
    padding: 0.5rem 1rem;
    background: #2FA634;
    color: white;
    margin-top: 1rem;
    font-size: 1rem;
    border-radius: 10px;
    text-decoration: none;
    width: max-content;
}

.reject {
    background: #555;
}

@media screen and (max-width:468px) {
    .left img {
        display: block;
        margin: auto;
    }
}

@media screen and (max-width:769px) {
    .left {
        width: clamp(300px, 80%, 600px);
        padding: 3rem 0 2rem;
        position: relative;
        margin: auto;
        height: auto;
        overflow-y: hidden;
    }

    .left ul li {
        gap: 5px;
    }

    .right {
        width: 100%;
        position: relative;
        min-height: 20vh;
        padding: 1rem;
    }
}
</style>