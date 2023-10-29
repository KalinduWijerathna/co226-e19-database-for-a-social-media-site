<template>
    <div class="create-post">
        <div class="container">
            <div class="post">
                <div class="post-header">
                    <div class="profile">
                        <img :src="profpic" alt="">
                        <h4>{{ fname + " " + lname }}</h4>
                        <p>@{{ uname }}</p>
                    </div>
                    <div class="date">
                        <img src="@/assets/Time_light.png" alt="">
                        <p>Now</p>
                    </div>
                </div>
                <div class="post-text">
                    <textarea ref="autoResizeTextarea" v-model="content" placeholder="Add a caption"></textarea>
                </div>
                <div class="media-content">
                    <img v-if="m_type == 0"
                        :src="filePreview || 'https://www.bluecoatacademy.org/wp-content/themes/absolutebyte/assets/images/placeholder-image.jpg'"
                        alt="">
                    <video v-if="m_type == 1" :src="filePreview" controls></video>
                    <comp-post-share v-if="m_type == 2 && post" :post="post" />
                </div>
                <div class="post-actions">
                    <button><img src="@/assets/heart.png" alt=""></button>
                    <button><img src="@/assets/comment.png" alt=""></button>
                    <button><img src="@/assets/share.png" alt=""></button>
                </div>
            </div>
        </div>
        <div class="option-deck">
            <button @click="focusContent" class="option-btn">
                <img src="@/assets/Edit_fill.png" alt="">
            </button>
            <div class="file-input">
                <label for="picture"><img src="@/assets/Img_box_light.svg" alt=""></label>
                <input type="file" id="picture" @change="pictureHandle" accept=".png ,.jpg ,.gif">
            </div>
            <div class="file-input">
                <label for="video"><img src="@/assets/Video_file_light.svg" alt=""></label>
                <input type="file" id="video" @change="videoHandle" accept=".mp4">
            </div>
            <button class="option-btn send" @click="postSend">
                <img src="@/assets/Send_fill.svg" alt="">
            </button>
        </div>
        <div class="private-public">
            <input type="checkbox" v-model="visibility" id="visibility">
            <label for="visibility">Friends Only</label>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import compPostShare from "@/components/compPostShare.vue";

const router = useRouter()
const route = useRoute()
const store = useStore()


const user = store.state.user
const fname = ref(user.first_name)
const lname = ref(user.last_name)
const uname = ref(user.user_name)
const profpic = ref(user.profile_picture)
const content = ref("")
const file = ref("")
const fileURL = ref("")
const filePreview = ref()
const m_type = ref(0)
const visibility = ref("")
const post = ref("")


// content input auto resize
const autoResizeTextarea = ref(null);

const adjustTextareaHeight = () => {
    const textarea = autoResizeTextarea.value;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
};

watch(content, adjustTextareaHeight);

// focus content
const focusContent = () => {
    window.scrollTo(0, 0)
    autoResizeTextarea.value.focus()
}

// picture input
const pictureHandle = (e) => {
    m_type.value = 0
    file.value = e.target.files[0]
    if (file.value)
        filePreview.value = URL.createObjectURL(e.target.files[0])
}

// video input
const videoHandle = (e) => {
    m_type.value = 1
    file.value = e.target.files[0]
    if (file.value)
        filePreview.value = URL.createObjectURL(e.target.files[0])
}

const postSend = async () => {
    store.state.loading = true
    const formdata = new FormData()
    formdata.append('media', file.value)

    try {
        const date = new Date(Date.now())
        if (file.value) {
            const res = await axios.post("/media/upload", formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            fileURL.value = res.data.mediaURL;
        }

        await axios.post("/post/add", {
            content: content.value,
            media: fileURL.value,
            m_type: m_type.value,
            private: visibility.value ? 1 : 0
        })

        store.state.loading = false
        router.push("/")
    }
    catch (err) {
        store.commit("addError", err.response.data.error)
    }
    store.state.loading = false
}

onMounted(() => {
    if (route.query.post) {
        post.value = route.query.post
        m_type.value = 2
        fileURL.value = post.value
        adjustTextareaHeight()
    }
})

</script>

<style scoped>
.create-post {
    background: #ddd;
    min-height: calc(100vh - 4rem);
}

.container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 0;
}

.post {
    background: white;
    max-width: 450px;
    width: 90%;
}

.post .post-header {
    display: flex;
    align-items: center;
    padding: 1rem;
}

.post .post-header .profile {
    display: grid;
    grid-column: 5rem auto;
    grid-row: 1fr 1fr;
}

.post .post-header .profile img {
    grid-column: 1;
    grid-row: 1/3;
    height: 3.5rem;
    width: 3.5rem;
    border-radius: 50%;
    border: 2px solid #2FA634;
    object-fit: cover;
}

.post .post-header .profile h4 {
    font-size: 1.2rem;
    grid-column: 2;
    grid-row: 1;
    margin-left: 0.75rem;
    margin-top: auto;
}

.post .post-header .profile p {
    font-size: 0.8rem;
    margin-left: 0.75rem;
    color: #555;
}

.post .post-header .date {
    display: flex;
    align-items: center;
    margin-left: auto;
    font-size: 0.9rem;
    color: #555;
}

.post .post-header .date img {
    height: 0.9rem;
    margin-right: 5px;
}

.post .post-text {
    padding: 0 1rem;
    font-weight: 300;
}

.post .post-text textarea {
    background: none;
    padding: none;
    border: none;
    font-weight: 400;
    width: 100%;
    font-size: 1rem;
    resize: none;
    overflow: hidden;
}

.post .post-text textarea:focus {
    outline: none;
}

.post .media-content {
    background: #ddd;
    border: 5px solid white;
}

.post .media-content img,
.post .media-content video {
    padding: 1rem 0 0;
    width: 100%;
    object-fit: contain;
    max-height: 400px;
}

.post .post-actions {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 1rem 1rem;
}

.post .post-actions button {
    background: none;
    border: none;
}

.post .post-actions button img {
    height: 1.3rem;
}

.option-deck {
    position: fixed;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    right: 2rem;
    bottom: 2rem;
}

.file-input input {
    display: none;
}


.file-input label {
    height: 40px;
    width: 40px;
    box-shadow: 0 0 5px #00000033;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 2px;
    cursor: pointer;
}

.file-input label img {
    height: 27px;
    width: 27px;
    object-fit: contain;
}

.option-btn {
    height: 40px;
    width: 40px;
    box-shadow: 0 0 5px #00000033;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 2px;
}

.option-btn.send {
    background: #2FA634;
    padding: 2px 2px 0 0;
}

.option-btn.send img {
    filter: invert();
    height: 30px;
}

.private-public {
    position: fixed;
    bottom: 2rem;
    left: 1rem;
    display: flex;
    align-items: center;
    gap: 10px;
}

.private-public input {
    height: 20px;
    width: 20px;
}

@media screen and (max-width: 769px) {
    .post .post-header .profile img {
        height: 40px;
        width: 40px;
    }

    .post .post-header .profile h4 {
        font-size: 0.9rem;
    }

    .post .post-header .profile p {
        font-size: 0.7rem;
    }

    .post .post-header .date {
        font-size: 0.8rem;
    }

    .post .post-text textarea {
        font-size: 0.9rem;
    }

    .post .post-actions button img {
        height: 1.2rem;
    }
}
</style>