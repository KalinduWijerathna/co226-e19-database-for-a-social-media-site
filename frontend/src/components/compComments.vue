<template>
    <div>
        <div @click="close" class="close"></div>
        <div class="comment-deck">
            <div class="header">
                <button @click="close"><img src="@/assets/Close_square_light.svg" alt=""></button>
            </div>
            <div class="body">
                <comp-comment v-for="(comment, index) in comments" :key="index" :comment="comment" />
            </div>
            <div class="footer">
                <textarea ref="autoResizeTextarea" v-model="content" placeholder="Add a caption"></textarea>
                <button @click="sendComment"><img src="@/assets/Send_fill.svg" alt=""></button>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from "axios"
import { onMounted, onUnmounted, ref, watch } from "vue"
import { useStore } from "vuex"
import compComment from "./compComment.vue"

const emits = defineEmits(['close'])
const store = useStore()
const close = () => { emits('close') }

const content = ref("")

const comments = ref([])

const getComments = (id) => {
    axios.get(`/comment/get/${id}`, {
        retry: 3, // Number of retry attempts
        retryDelay: 1000, // Delay between retries in milliseconds
        timeout: 5000 //
    })
        .then((res) => {
            console.log(res.data)
            comments.value = res.data
        }).catch((err) => {
            store.commit("addError", err.response.data.error)
        })
}

const sendComment = () => {
    axios.post(`/comment/add`, {
        p_id: props.postId,
        content: content.value
    }).then(async () => {
        content.value = ""
        comments.value = await getComments(store.state.currComPost)
        emits('change')
    }).catch((err) => {
        store.commit("addError", err.response.data.error)
    })
}

onMounted(() => {
    getComments(store.state.currComPost)
})

const autoResizeTextarea = ref(null);

const adjustTextareaHeight = () => {
    const textarea = autoResizeTextarea.value;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
};

watch(content, adjustTextareaHeight);

</script>

<style scoped>
.comment-deck {
    position: fixed;
    top: 5rem;
    height: calc(100vh - 8rem);
    width: clamp(300px, 90%, 500px);
    left: 50%;
    display: flex;
    flex-direction: column;
    transform: translateX(-50%);
    padding: 1rem;
    background: white;
    box-shadow: 0 0 10px #00000033;
    z-index: 10;
}

.comment-deck .header {
    display: flex;
    margin-bottom: 1rem;
}

.comment-deck .header button {
    margin-left: auto;
}

.comment-deck .body {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    height: 80%;
    overflow-y: scroll;
    padding: 1rem 0;
}

.comment-deck .footer {
    min-height: 4rem;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.comment-deck .footer textarea {
    background: none;
    padding: none;
    border-radius: 5px;
    padding: 5px 10px;
    font-weight: 400;
    width: 100%;
    font-size: 1rem;
    resize: none;
    overflow: hidden;
    align-self: flex-end;
}

.comment-deck .footer textarea:focus {
    outline: none;
}

.comment-deck .footer button img {
    width: 30px;
}

.close {
    position: fixed;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
    background: #00000011;
    z-index: 8;
}
</style>