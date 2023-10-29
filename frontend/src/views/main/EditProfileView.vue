<template>
    <div class="sign container">
        <form @submit.prevent="submit">
            <div class="profile-pic">
                <label for="profpic" class="img">
                    <p :class="hasImg">Choose a picture</p>
                    <img :src="imgTempSrc" alt="">
                </label>
                <input id="profpic" type="file" @change="fileHandle" accept=".jpg, .png">
            </div>
            <div class="form-input" style="margin-bottom: 2rem;">
                <label for="">Change Password</label>
                <input type="password" placeholder="new Password" v-model="password">
            </div>
            <div class="form-input">
                <label for="">First name</label>
                <input type="text" placeholder="john" v-model="fname">
            </div>
            <div class="form-input">
                <label for="">Last name</label>
                <input type="text" placeholder="job" v-model="lname">
            </div>
            <div class="form-input">
                <label for="">Email</label>
                <input type="text" placeholder="job" v-model="email">
            </div>
            <div class="form-input">
                <label for="">Birth Day</label>
                <input type="date" v-model="dob">
            </div>
            <div class="form-radio">
                <p>Gender</p>
                <input type="radio" id="male" value="1" v-model="sex">
                <label for="male">Male</label>
                <input type="radio" id="female" value="0" v-model="sex">
                <label for="female">Female</label>
            </div>
            <div class="form-select">
                <label for="">Location</label>
                <div class="dropdown">
                    <input class="dropdown-input" type="text" v-model="loc" placeholder="Location" />
                    <div class="dropdown-list" v-if="filterLocations.length > 0">
                        <div v-for="item in filterLocations" @click="setLocation(item)" :key="item" class="dropdown-item">
                            {{ item }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-input" style="margin-top: 1rem;">
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
import { computed, onMounted, ref, watch } from 'vue';
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

const loc = ref("")
const filterLocations = ref([])

const Locations = computed(async () => {
    const baseUrl = 'https://nominatim.openstreetmap.org/search';

    const params = {
        q: loc.value,
        format: 'json',
        limit: 10
    };

    try {
        let locations = []
        const response = await axios.get(baseUrl, { params }, {
            headers: {},
        });

        // Process the data (example: print place names)
        response.data.forEach(place => {
            locations.push(place.display_name || 'N/A');
        });

        return locations

    } catch (error) {
        store.commit("addError", error);
    }
})

watch(Locations, async () => {
    filterLocations.value = await Locations.value
})

const setLocation = (location) => {
    loc.value = location
    filterLocations.value = []
}

const updateCheckedInterests = (selectedInterests) => {
    interestsList.value.forEach(interestItem => {
        interestItem.checked = selectedInterests.includes(interestItem.interest);
    });
}

const fname = ref("")
const lname = ref("")
const email = ref("")
const dob = ref("")
const sex = ref(1)
const affiliation = ref()
const bio = ref()
const password = ref()
const interests = computed(() => {
    return interestsList.value
        .filter(interest => interest.checked)
        .map(interest => interest.interest);
})
const prePropic = ref("")

const getUser = async () => {
    store.state.loading = true
    try {
        const res = await axios.get(`/profile/${store.state.user.user_name}`)
        const user = res.data
        fname.value = user.first_name
        lname.value = user.last_name
        email.value = user.email
        dob.value = new Date(user.b_year, user.b_month, user.b_date).toISOString().slice(0, 10)
        sex.value = user.sex
        if (user.profile_picture) {
            imgTempSrc.value = user.profile_picture
            prePropic.value = user.profile_picture
            hasImg.value = "hasImg"
        }
        affiliation.value = user.affiliation
        bio.value = user.bio
        updateCheckedInterests(user.interests)
        loc.value = user.location
    }
    catch (err) {
        store.commit("addError", err)
    }
    store.state.loading = false
}

const getUserFinal = async () => {
    store.state.loading = true
    try {
        const res = await axios.get(`/profile/${store.state.user.user_name}`)
        store.state.loading = false
        return res.data
    }
    catch (err) {
        store.commit("addError", err)
    }
    store.state.loading = false
}

const submit = async () => {
    store.state.loading = true
    const formdata = new FormData()
    formdata.append('profile_picture', file.value)

    try {
        let resFile = ""
        if (file.value && prePropic.value !== file.value) {
            if (prePropic.value !== "") {
                await axios.delete("/profile_picture/delete")
            }
            resFile = await axios.put("/profile_picture/update", formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
        }

        await axios.post("/update_profile/", {
            u_id: store.state.user.u_id,
            first_name: fname.value,
            last_name: lname.value,
            email: email.value,
            sex: sex.value,
            password: password.value,
            b_year: new Date(dob.value).getFullYear(),
            b_month: new Date(dob.value).getMonth(),
            b_date: new Date(dob.value).getDate(),
            location: loc.value,
            bio: bio.value,
            interests: interests.value,
            affiliation: affiliation.value,
            profile_picture: resFile ? resFile.data.downloadURL : prePropic.value
        })

        store.state.user = await getUserFinal()
        store.state.loading = false
        router.push(`/profile/${store.state.user.user_name}`)
    }
    catch (err) {
        store.commit("addError", err.response.data.error)
    }
    store.state.loading = false
}

onMounted(async () => {
    await getUser()
})

</script >

<style scoped>
.sign {
    display: flex;
    align-items: center;
    padding-bottom: 4rem;
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

.form-input {
    margin-bottom: 1.5rem;
}

.form-input input {
    width: 100%;
    margin-bottom: 1rem;
    background: none;
    border-bottom: 1px solid #ccc;
    border-radius: 0;
    padding-inline: 10px;
    margin: 0;
}

.form-input input:focus {
    outline: none;
    border-width: 2px;
    border-color: #333;
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


.form-select {
    margin-top: 0.75rem;
    font-size: 1rem;
    color: #333;
    margin-bottom: 0.25rem;
}

.dropdown {
    position: relative;
    width: 100%;
    margin: 0 auto;
}

.dropdown-input {
    width: 100%;
    margin-bottom: 1rem;
    background: none;
    border-bottom: 1px solid #ccc;
    border-radius: 0;
    padding-inline: 10px;
    margin: 0;
}

.dropdown-input:focus {
    outline: none;
    border-width: 2px;
    border-color: #333;
}

.dropdown-input:focus {
    background: #fff;
    border-color: #e2e8f0;
}

.dropdown-input::placeholder {
    opacity: 0.7;
}

.dropdown-list {
    width: 100%;
    box-shadow: 0 0 10px #e2e8f0;
    padding: 0.5rem 0;
}

.dropdown-list .dropdown-item {
    padding: 0.5rem 1rem;
    color: #555;
    cursor: pointer;
}

.form-radio p {
    display: block;
    font-size: 1rem;
    color: #333;
    margin-bottom: 0.25rem;
}

.form-radio input {
    margin: 1rem 0;
    margin-left: 10px;
}

.form-radio label {
    color: #222;
    margin-inline: 0.25rem 1.5rem;
    cursor: pointer;
}

.form-input input[type="date"] {
    width: 100%;
    border: none;
    margin-bottom: 1rem;
    background: none;
    border-bottom: 1px solid #ccc;
    border-radius: 0;
    padding: 10px;
    margin: 0;
}

button[type="submit"] {
    padding: 0.5em 1.5em;
    border-radius: 2rem;
    border: none;
    display: block;
    margin: auto;
    width: 90%;
    max-width: 300px;
    margin-top: 3rem;
    font-size: 1rem;
    font-weight: 500;
    background: #2FA634;
    color: white;
}
</style>