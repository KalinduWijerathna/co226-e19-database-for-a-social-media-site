<template>
    <div class="dash">
        <div class="container">
            <div class="flex-box">
                <div class="post-deck">
                    <comp-post v-for="post in filteredPosts" :key="post.id" :post="post" />
                    <p style="color:#555" v-if="posts && filteredPosts.length == 0">nothing to show here</p>
                </div>
                <div class="comm-deck">
                    <div class="friends">
                        <h2>Friends</h2>
                        <div class="friend-deck" v-if="friends">
                            <router-link :to="`profile/${friend.user_name}`" class="profile" v-for="friend in friends"
                                :key="friend.user_name">
                                <img :src="friend.profile_picture" alt="">
                                <h4>{{ friend.first_name + " " + friend.last_name }}</h4>
                                <p>@{{ friend.user_name }}</p>
                            </router-link>
                            <div class="friends-fallback" v-if="friends.length == 0">
                                <p>Find friends to get in touch with them</p>
                            </div>
                            <router-link class="find" to="/find-friends">Find freinds</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <router-link to="/create-post" class="create"><img src="../../assets/Edit_fill.png" alt=""><span>Create
                Post</span></router-link>
    </div>
</template>

<script setup>
import axios from 'axios';
import compPost from '@/components/compPost.vue';
import compComment from '@/components/compComment.vue';
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import io from "socket.io-client"

const store = useStore()

const posts = ref([])
const viewCondArray = ref([])
const filteredPosts = computed(() => {
    return posts.value.filter((post, index) => viewCondArray.value[index]);
})
const friends = ref([])
const user = store.state.user

const getPosts = () => {
    return new Promise(async (resolve, reject) => {
        store.state.loading = true;
        try {
            const result = await axios.get(`/post_feed/`);
            store.state.loading = false;
            resolve(result.data); // Resolve the promise with the fetched data
        } catch (err) {
            console.log(err);
            store.state.loading = false;
            reject(err); // Reject the promise with the error
        }
    });
};

const getFriends = async () => {
    store.state.loading = true
    try {
        const result = await axios.get(`/search_friend/all`);
        store.state.loading = false
        return result.data
    }
    catch (err) {
        console.log(err)
    }
    store.state.loading = false
}

onMounted(async () => {
    try {
        posts.value = await getPosts()
        friends.value = await getFriends()
    }
    catch (err) {
        console.log(err)
    }


    viewCondArray.value = Array.from({ length: posts.value.length }, () => false)
    viewCondArray.value[0] = true
    viewCondArray.value[1] = true

    window.addEventListener("scroll", () => {
        const scrollFactor = parseInt(window.scrollY / window.innerHeight)
        const index = scrollFactor * 2
        viewCondArray.value[index] = true
        viewCondArray.value[index + 1] = true
    });

    const socket = io('https://peralink-backend.onrender.com/post'); // Change the URL to match your server and namespace

    // Listen for new post event
    socket.on('newPost', (newPost) => {
        posts.value.unshift(newPost);
    });

    // Listen for deleted post event
    socket.on('deletedPost', (deletedPostId) => {
        posts.value = posts.value.filter(post => post.id !== deletedPostId);
    });

})

</script>

<style setup>
.dash {
    background: #ddd;
    min-height: calc(100vh - 4rem);
}

.post-deck {
    width: 60%;
    padding: 2rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.comm-deck {
    position: fixed;
    right: 0;
    height: 100vh;
    width: 40%;
    min-width: 300px;
    padding: 2rem 1rem;
    background: white;
}

.friends h2 {
    margin-bottom: 2rem;
}

.friends .friend-deck {
    height: 70vh;
    overflow-y: scroll;
}

.friends .profile {
    display: grid;
    grid-template-columns: 3rem auto;
    grid-template-rows: 1fr 1fr;
    width: auto;
    margin: 1rem 0;
    text-decoration: none;
}

.friends .profile img {
    grid-column: 1;
    grid-row: 1/3;
    height: 3rem;
    width: 3rem;
    border-radius: 50%;
    border: 2px solid #2FA634;
    object-fit: cover;
}

.friends .profile h4 {
    font-size: 1rem;
    grid-column: 2;
    grid-row: 1;
    margin-left: 0.75rem;
    margin-top: auto;
    color: black;
}

.friends .profile p {
    font-size: 0.8rem;
    margin-left: 0.75rem;
    color: #555;
}

.friends-fallback p {
    font-size: 0.9rem;
    color: #555;
}

.find {
    padding: 0.5rem 1rem;
    color: white;
    background: #2FA634;
    border-radius: 3px;
    display: block;
    margin: 1rem auto;
    text-decoration: none;
    width: max-content;
}


.create {
    position: fixed;
    bottom: 2rem;
    left: 2rem;
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    background: #043228;
    color: white;
    gap: 10px;
    border-radius: 2rem;
    text-decoration: none;
}

.create img {
    filter: invert();
    height: 20px;
}

@media screen and (max-width: 769px) {
    .nav-bar .container {
        padding: 0 1rem;
    }

    .nav-bar .logo h3 {
        display: none;
    }

    .create {
        left: auto;
        right: 1rem;
        border-radius: 50%;
        height: 40px;
        width: 40px;
        padding: 0 0 3px;
        justify-content: center;
    }

    .create span {
        display: none;
    }

    .post-deck {
        width: 100%;
    }

    .comm-deck {
        display: none;
    }
}
</style>