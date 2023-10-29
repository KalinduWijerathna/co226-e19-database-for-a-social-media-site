<template>
    <div class="like-menu">
        <button @click="setLike(like != null ? null : 1)" @touchstart="showMenu" @mouseover="showMenu" class="main-img">
            <span v-if="like">{{ like.emoji }}</span>
            <img v-else src="@/assets/heart.png" alt="" oncontextmenu="return false;">
        </button>
        <transition name="menu">
            <div class="menu-deck" v-if="viewMenu" @mouseleave="hideMenu">
                <button @click=" setLike(index)" v-for="(like, index) in likes" :key="index" @touchend="setLike(index)">
                    {{ like.emoji }}
                </button>
            </div>
        </transition>
    </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

const props = defineProps(['postId'])
const store = useStore()
const emits = defineEmits(["change"])

const viewMenu = ref(false)
const like = ref(null)
const likes = [
    {
        id: 1,
        name: 'like',
        emoji: '👍',
    },
    {
        id: 2,
        name: 'love',
        emoji: '❤️',
    },
    {
        id: 3,
        name: 'ha ha',
        emoji: '😄',
    },
    {
        id: 4,
        name: 'wow',
        emoji: '😲',
    },
    {
        id: 5,
        name: 'sad',
        emoji: '😢',
    },
    {
        id: 6,
        name: 'angry',
        emoji: '😡',
    },
]


const showMenu = () => {
    viewMenu.value = true
}

const hideMenu = () => {
    viewMenu.value = false
}

const setLike = async (index) => {
    if (like.value !== likes[index]) {
        if (index !== null) {
            like.value = likes[index]
            viewMenu.value = false
            await removeLike()
            await sendLike(like.value.id || 0)
        }
        else if (index == null) {
            like.value = likes[index]
            await removeLike()
        }
        emits("change")
    }
}

const sendLike = async (like_id) => {
    console.log(props.postId)
    try {
        await axios.post("/post_like/add", {
            p_id: props.postId,
            liketype_id: like_id,
        })
    }
    catch (err) {
        store.commit("addError", err.response.data.error)
    }
}

const getLike = async (id) => {
    try {
        const res = await axios.get("/post_like/", {
            params: {
                p_id: id,
            }
        })
        return res.data.like - 1
    }
    catch (err) {
        store.commit("addError", err.response.data.error)
    }
}

const removeLike = async () => {
    try {
        await axios.delete("/post_like/delete", {
            data: {
                p_id: props.postId,
            }
        })
    }
    catch (err) {
        store.commit("addError", err.response.data.error)
    }
}

onMounted(async () => {
    await setTimeout(() => { }, 100)
    const index = await getLike(props.postId)
    like.value = likes[index]
})
</script>

<style scoped>
.like-menu {
    position: relative;
}

.like-menu .main-img {
    background: none;
    border: none;
}

.like-menu .main-img img {
    height: 1.5rem;
    user-select: none;
}

.like-menu .main-img span {
    font-size: 1.5rem;
    user-select: none;
}

.like-menu .menu-deck {
    position: absolute;
    display: flex;
    align-items: center;
    padding: 1rem;
    gap: 1rem;
    top: -4rem;
    left: 0;
    background: white;
    border-radius: 10px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.like-menu .menu-deck button {
    font-size: 1.5rem;
    background: none;
    border: none;
    user-select: none;
}

.menu-enter-from,
.menu-leave-to {
    top: 0;
    transform: scale(0);
    transform-origin: bottom left;
}

.menu-enter-active,
.menu-leave-active {
    transition: 0.25s all;
}

@media screen and (max-width:769px) {
    .like-menu .main-img img {
        height: 1.3rem;
    }

    .like-menu .main-img span {
        font-size: 1.3rem;
    }
}
</style>