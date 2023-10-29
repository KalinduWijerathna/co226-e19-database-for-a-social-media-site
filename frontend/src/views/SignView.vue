<template>
    <div class="signup">
        <img class="bg" src="@/assets/_add558a1-c25c-47a9-8a6e-67ca5f1dce1d.jpg" alt="">
        <div class="container">
            <div class="header">
                <div class="progress-bar">
                    <div class="progress-line">
                        <div class="progress-fill" :style="`width:${(activeRouteIndex - 1) * 50}%`"></div>
                    </div>
                    <div
                        :class="`progress-item ${activeRouteIndex > 0 ? 'active' : ''} ${activeRouteIndex === 1 ? 'exactactive' : ''}`">
                        <p>Create Account</p>
                        <div class="progress-point" id="prog1">1</div>
                    </div>
                    <div
                        :class="`progress-item ${activeRouteIndex > 1 ? 'active' : ''} ${activeRouteIndex === 2 ? 'exactactive' : ''}`">
                        <p>Tell more about you</p>
                        <div class="progress-point" id="prog2">2</div>
                    </div>
                    <div
                        :class="`progress-item ${activeRouteIndex > 2 ? 'active' : ''} ${activeRouteIndex === 3 ? 'exactactive' : ''}`">
                        <p>Final step</p>
                        <div class="progress-point" id="prog3">3</div>
                    </div>
                </div>
            </div>
            <div class="body">
                <router-view />
            </div>
            <p class="copyright">Copyright PeraLink 2023</p>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const activeRouteIndex = computed(() => {
    return router.currentRoute.value.meta.index
})

</script>

<style>
.signup {
    position: relative;
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 2rem;
}

.signup .bg {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: -1;
    object-fit: cover;
}

.signup .container {
    border-radius: 2rem;
    background: white;
    padding: 2rem;
    min-height: 80vh;
}

.signup .header {
    height: 5rem;
    display: grid;
    place-content: center;
}

.header .progress-bar {
    height: 30px;
    width: 60vw;
    min-width: 250px;
    max-width: 700px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    margin-bottom: 2rem;
    margin-top: 1rem;
}

.header .progress-bar .progress-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}

.header .progress-bar .progress-item p {
    font-family: 'Raleway', sans-serif;
    font-size: 0.9rem;
    font-weight: 300;
    color: #888;
    position: absolute;
    width: max-content;
    top: -1.6rem;
}

.header .progress-bar .progress-point {
    height: 20px;
    width: 20px;
    display: flex;
    place-content: center;
    align-items: center;
    border-radius: 50%;
    background: #bbb;
    z-index: 2;
    font-size: 0.8rem;
    font-weight: 600;
    color: white;
    transition: 0.5s 1s transform;
}

.header .progress-bar .progress-item.active .progress-point {
    background: #2FA634;
}

.header .progress-bar .progress-item.exactactive p {
    font-size: 1rem;
    font-weight: 500;
    color: #2FA634;
}

.header .progress-bar .progress-item.exactactive .progress-point {
    transform: scale(1.2);
}

.header .progress-bar .progress-line {
    position: absolute;
    top: 50%;
    left: 50%;
    height: 3px;
    width: calc(100% - 6px);
    transform: translate(-50%, -50%);
    background: #bbb;
}

.header .progress-bar .progress-fill {
    position: absolute;
    top: 0%;
    height: 3px;
    width: 50%;
    background: #2FA634;
    transition: 1s all;
}

.sign .form-input {
    margin-bottom: 1.5rem;
}

.sign .form-input input {
    width: 100%;
    margin-bottom: 1rem;
    background: none;
    border-bottom: 1px solid #ccc;
    border-radius: 0;
    padding-inline: 10px;
    margin: 0;
}

.sign .form-input input:focus {
    outline: none;
    border-width: 2px;
    border-color: #333;
}

.sign h3 {
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 2rem;
    text-align: center;
}

.sign .form-input label {
    display: block;
    font-size: 0.9rem;
    color: #333;
    margin-bottom: 0.25rem;
}

.sign .form-input p {
    font-size: 0.8rem;
    color: red;
    margin-top: 5px;
}

.sign button[type="submit"] {
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

.copyright {
    position: absolute;
    bottom: 0.5rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.7rem;
    color: white;
}

@media screen and (max-width: 769px) {
    .signup {
        padding: 1rem 0;
    }

    .signup .bg {
        display: none;
    }

    .signup h3 {
        margin: 1rem 0 2rem;
    }

    .signup .logo {
        height: 75px;
        width: 100%;
        object-fit: contain;
    }

    .signup .header {
        display: none;
    }

    .copyright {
        color: #555;
    }
}
</style>