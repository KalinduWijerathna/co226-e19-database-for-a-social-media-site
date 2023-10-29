<template>
    <div class="like-menu">
        <button @click="setLike(like != null ? null : 0)" @touchstart="showMenu" @mouseover="showMenu"
            :class="`main-img ${like ? 'like' : ''}`" :style="`color:${like ? like.color : '#333'}`">
            {{ like ? like.name : 'Like' }}
        </button>
        <transition name="menu">
            <div class="menu-deck" v-if="viewMenu" @mouseleave="hideMenu">
                <button @click="setLike(index)" v-for="(like, index) in likes" :key="index" @touchend="setLike(index)">
                    {{ like.emoji }}
                </button>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useStore } from "vuex";


const store = useStore()
const props = defineProps(['commentID', "like", "post"])

const viewMenu = ref(false)
const like = ref(null)
const likes = [
    {
        id: 1,
        name: 'like',
        emoji: '👍',
        color: '#00d',
    },
    {
        id: 2,
        name: 'love',
        emoji: '❤️',
        color: '#e30a0a'
    },
    {
        id: 3,
        name: 'ha ha',
        emoji: '😄',
        color: '#F7B125'
    },
    {
        id: 4,
        name: 'wow',
        emoji: '😲',
        color: '#F7B125'
    },
    {
        id: 5,
        name: 'sad',
        emoji: '😢',
        color: '#F7B125'
    },
    {
        id: 6,
        name: 'angry',
        emoji: '😡',
        color: '#E97516'
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
            await sendLike(like.value.id)
        }
        else if (index == null) {
            like.value = likes[index]
            await removeLike()
        }
    }
}

const sendLike = async (like_id) => {
    try {
        await axios.post("/comment_like/add", {
            comment_id: props.commentID,
            liketype_id: like_id,
            post: props.post
        })
    }
    catch (err) {
        store.commit("addError", err.response.data.error)
    }
}

const removeLike = async () => {
    try {
        await axios.delete("/comment_like/delete", {
            data: {
                comment_id: props.commentID,
                post: props.post
            }
        })
    }
    catch (err) {
        store.commit("addError", err.response.data.error)
    }
}

onMounted(() => {
    setTimeout(() => {
        like.value = likes[props.like - 1]
    }, 200)
})
</script>

<style scoped>
.like-menu {
    position: relative;
    height: 22px;
    margin-right: 1rem;
    margin-left: auto;
}

.like-menu .main-img {
    background: none;
    border: none;
    color: #333;
}

.like-menu .main-img.like {
    font-weight: 600;
}

.like-menu .menu-deck {
    position: absolute;
    display: flex;
    align-items: center;
    padding: 1rem;
    gap: 1rem;
    top: -4rem;
    left: 0;
    transform: translateX(-50%);
    background: white;
    border-radius: 10px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    z-index: 3;
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