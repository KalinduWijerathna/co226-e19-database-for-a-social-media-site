<template>
    <div class="comment">
        <div class="prof-pic">
            <img :src="comment.propic" alt="" />
        </div>
        <div class="com">
            <h5><router-link :to="`/profile/${comment.uname}`">{{ comment.fname }} {{
                comment.lname }}</router-link></h5>
            <p>
                {{ comment.content }}
            </p>
            <div class="footer">
                <div class="likes" v-if="comment.likeCount">
                    <div class="like-deck">
                        <p v-for="(type, index) in comment.liketypes" :key="index">
                            {{ likes[type - 1] ? likes[type - 1].emoji : '' }}
                        </p>
                    </div>
                    <span>{{ comment.likeCount }}</span>
                </div>
                <comp-com-like-menu :commentID="props.comment.id" @change="loadComment(props.comment.id)" />
                <p>{{ comment.date }}</p>
            </div>
            <button class="del" v-if="comment.uname == store.state.user.user_name" @click="deleteComment">
                <img src="https://th.bing.com/th/id/R.6c6076b5539e080de7f08ca78b915d92?rik=XwvNBEqhthlBug&riu=http%3a%2f%2fcdn.onlinewebfonts.com%2fsvg%2fimg_408479.png&ehk=QaDRFwORrQoYDEsEYfH%2bwUwF4%2bqfRV6UHFVOz4qzksM%3d&risl=&pid=ImgRaw&r=0"
                    alt="">
            </button>
        </div>
    </div>
</template>

<script setup>
import { defineProps, onMounted, ref } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import compComLikeMenu from "./compComLikeMenu.vue";

const props = defineProps(['comment']);
const store = useStore()
const comment = ref({})

const likes = ref([
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
])

onMounted(async () => {
    comment.value = props.comment
})
</script>

<style scoped>
.comment {
    position: relative;
    border-radius: 1rem;
    box-shadow: 0 0 5px #00000033;
    width: fit-content;
    margin-left: 30px;
    width: 80%;
}

.comment .prof-pic {
    position: absolute;
    left: 0%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    height: 50px;
    width: 50px;
    background: white;
    border: 3px solid #35495e;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.comment .prof-pic img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.comment .com {
    width: 100%;
    text-align: left;
    padding: 1rem 1.5rem;
    padding-left: 40px;
    min-width: 250px;
}

.comment .com h5 a {
    text-decoration: none;
    font-family: "Raleway", sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    color: #011502;
}

.comment .com p {
    margin-top: 7px;
    font-weight: 400;
    font-size: 0.9rem;
    word-wrap: break-word;
}

.comment .footer {
    display: flex;
    align-items: center;
    margin-top: 10px;
    color: #011502;
}

.comment .com .footer p {
    margin: 0;
    font-size: 0.8rem;
}

.comment .com .footer button {
    background: none;
    border: none;
    font-size: 0.8rem;
    margin-right: 20px;
    cursor: pointer;
}

.footer .likes {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-right: auto;
}

.footer .likes .like-deck {
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    transform: scaleX(-1);
}

.footer .likes .like-deck p {
    margin-right: -5px;
}

.del {
    position: absolute;
    top: 10px;
    right: 10px;
}

.del img {
    height: 15px;
}
</style>
