<template>
    <div class="sign">
        <form @submit.prevent="submit">
            <h3>More About you</h3>
            <div class="form-input">
                <label for="">First Name</label>
                <input type="text" placeholder="John" v-model="fname">
            </div>
            <div class="form-input">
                <label for="">Last Name</label>
                <input type="text" placeholder="Doe" v-model="lname">
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
            <button type="submit">Continue</button>
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

const fname = ref("")
const lname = ref("")
const sex = ref("1")
const dob = ref("")
const dobd = computed(() => {
    return new Date(dob.value).getDate()
})
const dobm = computed(() => {
    return new Date(dob.value).getMonth()
})
const doby = computed(() => {
    return new Date(dob.value).getFullYear()
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
        const response = await axios.get(baseUrl, { params });

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

const submitData = computed(() => {
    return {
        u_id: store.state.currentSignupUser,
        first_name: fname.value,
        last_name: lname.value,
        sex: sex.value,
        b_date: dobd.value,
        b_month: dobm.value,
        b_year: doby.value,
        location: loc.value
    }
})

const submit = () => {
    axios
        .post("/signup/more", submitData.value)
        .then((res) => {
            console.log(res.data.message)
            router.push("/sign-up/finalize")
        })
        .catch((err) => {
            store.commit("addError", err.response.data.error)
        })
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

.form-select {
    margin-top: 0.75rem;
    font-size: 0.9rem;
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
    font-size: 0.9rem;
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
</style>