<template>
    <div class="sign">
        <form @submit.prevent="submit">
            <h3>Allmost There</h3>
            <div class="profile-pic">
                <label for="profpic" class="img">
                    <p :class="hasImg">Choose a picture</p>
                    <img :src="imgTempSrc" alt="">
                </label>
                <input id="profpic" type="file" @change="fileHandle" accept=".jpg, .png">
            </div>
            <div class="form-input">
                <label for="">Affiliation</label>
                <input type="text" placeholder="job" v-model="affiliation">
            </div>
            <div class="form-input">
                <label for="">Bio</label>
                <textarea rows="5" placeholder="I am ..." v-model="bio"></textarea>
            </div>
            <div class="form-input">
                <label>Interests</label>
                <input type="text" placeholder="sports" v-model="searchText">
                <div class="deck">
                    <div class="pill" v-for="(interest, index) in interestsList" :key="index">
                        <input :id="`int${index}`" type="checkbox" :value="interest.interest" @input="selectInterest(index)"
                            :checked="interest.checked">
                        <label :for="`int${index}`">
                            <span>{{ interest.interest }}</span>
                            <img src="../../assets/check.png" alt="">
                        </label>
                    </div>
                </div>
            </div>
            <button type="submit">Finish</button>
        </form>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';


const store = useStore()
const router = useRouter()

window.history.pushState(null, null, window.location.href);
window.onpopstate = function (event) {
    window.history.pushState(null, null, window.location.href);
};

const imgTempSrc = ref("")
const hasImg = ref("")
const file = ref()
const fileHandle = (e) => {
    file.value = e.target.files[0]
    imgTempSrc.value = URL.createObjectURL(e.target.files[0])
    hasImg.value = "hasimg"
}

const interestsList = ref([
    { interest: "Sports", checked: false },
    { interest: "Music", checked: false },
    { interest: "Art", checked: false },
    { interest: "Cooking", checked: false },
    { interest: "Travel", checked: false },
    { interest: "Technology", checked: false },
    { interest: "Fashion", checked: false },
    { interest: "Photography", checked: false },
    { interest: "Reading", checked: false },
    { interest: "Gaming", checked: false },
    { interest: "Fitness", checked: false },
    { interest: "Movies", checked: false },
    { interest: "Dancing", checked: false },
    { interest: "Nature", checked: false },
    { interest: "Writing", checked: false },
    { interest: "Science", checked: false },
    { interest: "History", checked: false },
    { interest: "Cycling", checked: false },
    { interest: "Yoga", checked: false },
    { interest: "DIY", checked: false },
    { interest: "Animals", checked: false },
    { interest: "Hiking", checked: false },
    { interest: "Singing", checked: false },
    { interest: "Swimming", checked: false },
    { interest: "Cars", checked: false },
    { interest: "Drawing", checked: false },
    { interest: "Coding", checked: false },
    { interest: "Languages", checked: false },
    { interest: "Mathematics", checked: false },
    { interest: "Food", checked: false },
    { interest: "Coffee", checked: false },
    { interest: "Tea", checked: false },
    { interest: "Pets", checked: false },
    { interest: "Cooking", checked: false },
    { interest: "Baking", checked: false },
    { interest: "Gardening", checked: false },
    { interest: "Vintage", checked: false },
    { interest: "Shopping", checked: false },
    { interest: "Volunteering", checked: false },
    { interest: "Crafts", checked: false },
    { interest: "Board Games", checked: false },
    { interest: "Puzzles", checked: false },
    { interest: "Mindfulness", checked: false },
    { interest: "Meditation", checked: false },
    { interest: "Running", checked: false },
    { interest: "Surfing", checked: false },
    { interest: "Skating", checked: false },
    { interest: "Skydiving", checked: false },
    { interest: "Skiing", checked: false },
    { interest: "Snowboarding", checked: false },
    { interest: "Horseback Riding", checked: false },
    { interest: "Camping", checked: false },
    { interest: "Concerts", checked: false },
    { interest: "Theater", checked: false },
    { interest: "Musicals", checked: false },
    { interest: "Comedy", checked: false },
    { interest: "History", checked: false },
    { interest: "Politics", checked: false },
    { interest: "Documentaries", checked: false },
    { interest: "Podcasts", checked: false },
    { interest: "Cooking Shows", checked: false },
    { interest: "Outdoor Adventures", checked: false },
    { interest: "Fashion Design", checked: false },
    { interest: "Interior Design", checked: false },
    { interest: "Sculpting", checked: false },
    { interest: "Pottery", checked: false },
    { interest: "Calligraphy", checked: false },
    { interest: "Archery", checked: false },
    { interest: "Fishing", checked: false },
    { interest: "Chess", checked: false },
    { interest: "Billiards", checked: false },
    { interest: "Painting", checked: false },
    { interest: "Origami", checked: false },
    { interest: "Film-making", checked: false },
    { interest: "Stargazing", checked: false },
    { interest: "Astronomy", checked: false },
    { interest: "Model Building", checked: false },
    { interest: "Woodworking", checked: false },
    { interest: "Virtual Reality", checked: false },
    { interest: "Robotics", checked: false },
    { interest: "Gardening", checked: false },
    { interest: "Rock Climbing", checked: false },
    { interest: "Fitness Training", checked: false },
    { interest: "Online Courses", checked: false },
    { interest: "Space Exploration", checked: false },
    { interest: "Antique Collecting", checked: false },
    { interest: "Fashion Photography", checked: false },
    { interest: "Graphic Design", checked: false },
    { interest: "Cookbook Authoring", checked: false },
    { interest: "Local History", checked: false },
    { interest: "Travel Photography", checked: false },
    { interest: "Sustainable Living", checked: false },
    { interest: "Aquarium Keeping", checked: false },
    { interest: "Outdoor Photography", checked: false },
    { interest: "Jewelry Making", checked: false },
    { interest: "Bird Watching", checked: false }
]);

const selectInterest = (index) => {
    if (interestsList.value[index].checked == true)
        interestsList.value[index].checked = false
    else
        interestsList.value[index].checked = true
}

const searchText = ref("")
watch(searchText, () => {
    document.querySelectorAll(".form-input .deck .pill").forEach((ele) => {
        if (!ele.firstElementChild.value.toLowerCase().includes(searchText.value.toLowerCase())) {
            ele.style.display = "none"
        }
        else {
            ele.style.display = "block"
        }
    })
})

const affiliation = ref()
const bio = ref()
const interests = computed(() => {
    return interestsList.value
        .filter(interest => interest.checked)
        .map(interest => interest.interest);
})

const submit = async () => {
    store.state.loading = true
    const formdata = new FormData()
    formdata.append('u_id', store.state.currentSignupUser)
    formdata.append('profile_picture', file.value)

    try {
        const profpicURL = await axios.post("/profile_picture/upload", formdata, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        await axios.post("/signup/final", {
            u_id: store.state.currentSignupUser,
            bio: bio.value,
            interests: interests.value,
            affiliation: affiliation.value,
            profile_picture: profpicURL.data.downloadURL
        })

        store.state.currentSignupUser = ""
        store.commit("addSuccess", "Account Created")
        router.push("/login")
    }
    catch (err) {
        store.commit("addError", err.response.data.error)
    }
    store.state.loading = false
}

</script >

<style scoped>
.sign {
    display: flex;
    align-items: center;
}

.sign .left {
    width: 50%;
    height: 500px;
    object-fit: contain;
}

.sign form {
    width: 100%;
    max-width: 600px;
    margin: auto;
}

.form-input textarea {
    width: 100%;
    border: none;
    margin-bottom: 1rem;
    background: none;
    border-bottom: 1px solid #ccc;
    border-radius: 0;
    padding-inline: 10px;
    margin: 0;
    margin-top: 1rem;
    font-size: 1rem;
    font-weight: 300;
}

.form-input textarea:focus {
    outline: none;
}

.profile-pic {
    display: flex;
    align-items: center;
    justify-content: center;
}

.profile-pic input {
    display: none;
}

.profile-pic .img {
    height: 200px;
    width: 200px;
    border-radius: 50%;
    border: 1px solid #ccc;
    margin: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    cursor: pointer;
}

.profile-pic .img p {
    font-weight: 300;
    font-size: 0.9rem;
    z-index: 2;
}

.profile-pic .img p.hasimg {
    box-shadow: 0 0 0 100px #00000055;
    background: #00000055;
    color: white;
    font-weight: 500;
    opacity: 0;
    transition: 0.5s all;
}

.profile-pic .img:hover p.hasimg {
    opacity: 1;
}

.profile-pic .img img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
}

.form-input .deck {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 1rem 10px;
    max-height: 150px;
    overflow-y: scroll;
}

.form-input .deck .pill label {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    border: 1px solid #029432;
}

.form-input .deck .pill label img {
    opacity: 0;
}

.form-input .deck .pill input {
    display: none;
}

.form-input .deck .pill input:checked+label {
    background: #029432;
    color: white;
    font-weight: 500;
}

.form-input .deck .pill input:checked+label img {
    opacity: 1;
}
</style>