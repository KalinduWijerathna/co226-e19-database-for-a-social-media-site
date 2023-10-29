<template>
    <div class="login">
        <div class="container">
            <div class="left">
                <img src="@/assets/LogoPC.png" alt="">
                <h4>Revive! Re Imagine! Re Connect!</h4>
            </div>
            <form class="right" @submit="login">
                <h3>Login</h3>
                <div class="txt-input">
                    <div class="badge">
                        <img src="@/assets/user.png" alt="">
                    </div>
                    <input type="text" name="username" placeholder="Username" v-model="user.user_name">
                </div>
                <p class="err" v-if="validate.user_name.$error">{{ validate.user_name.$errors[0].$message }}</p>
                <div class="txt-input">
                    <div class="badge">
                        <img src="@/assets/pass.png" alt="">
                    </div>
                    <input type="password" name="password" placeholder="Password" v-model="user.password">
                </div>
                <p class="err" v-if="validate.password.$error">{{ validate.password.$errors[0].$message }}</p>
                <div class="flex">
                    <compCheckbox id="rem" v-model="checkValue">
                        Remember me</compCheckbox>
                    <router-link to="">Forgot password ?</router-link>
                </div>
                <button class="submit">LOGIN</button>
                <div class="or">
                    <p>OR</p>
                </div>
                <div class="footer">
                    <p>Don’t have an account? <router-link to="/sign-up">Create one</router-link> </p>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import compCheckbox from '@/components/compCheckbox.vue'
import { ref, reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useStore } from 'vuex'
import axios from 'axios'
import { useRouter } from 'vue-router';

const router = useRouter()
const checkValue = ref()
const user = reactive({
    user_name: '',
    password: ''
})
const rule = {
    user_name: { required },
    password: { required }
}

const validate = useVuelidate(rule, user)
const store = useStore()

const login = async (e) => {
    e.preventDefault();
    const pass = await validate.value.$validate()
    if (!pass)
        return

    await axios
        .post("/login", user)
        .then(async (res) => {
            await store.commit('setLogin', { token: res.data.token, user: res.data.user })
            router.push("/")
        })
        .catch((err) => {
            store.commit("addError", err.response.data.error)
        })
}

</script>

<style scoped>
.login {
    height: 100vh;
    display: flex;
    background-image: url(@/assets/_add558a1-c25c-47a9-8a6e-67ca5f1dce1d.jpg);
    background-size: cover;
    background-position: center;
}

.container {
    width: clamp(280px, 90%, 1280px);
    min-height: 80vh;
    margin: auto;
    border-radius: 2rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.105);
    padding: 2rem;
    display: flex;
    background: white;
}

.container .left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
}

.container .left img {
    max-width: 300px;
}

.container .left h4 {
    font-size: 1.5rem;
    font-weight: 400;
    color: #64A56B;
    margin-top: 3rem;
}

.container .right {
    width: 50%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    position: relative;
}

.container .right h3 {
    font-size: 1.75rem;
    font-weight: 500;
    margin-bottom: 3rem;
}

.container .right .txt-input {
    display: flex;
    border-radius: 5px;
    border: 1px solid #B6B6B6;
    width: 100%;
    max-width: 350px;
    margin-top: 1rem;
    overflow: hidden;
}

.container .right .txt-input .badge {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 40px;
    background: #B6B6B6;
}

.container .right .txt-input .badge img {
    height: 17px;
}

.container .right .txt-input input {
    border: none;
    padding: 0.5rem 1rem;
    height: 40px;
    width: calc(100% - 40px);
    font-size: 1rem;
    margin: 0;
    border-radius: 0;
}

.container .right .txt-input input::placeholder {
    font-weight: 300;
}

p.err {
    font-size: 0.8rem;
    color: red;
    text-align: left;
    margin-top: 5px;
    width: 100%;
    max-width: 350px;
}

.container .right .flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 350px;
    font-size: 0.9rem;
    margin-top: 1rem;
}

.container .right .flex a {
    color: #2FA634;
}

.submit {
    width: 100%;
    max-width: 350px;
    padding: 10px;
    border-radius: 30px;
    margin-top: 2rem;
    border: none;
    font-size: 0.9rem;
    background: #2FA634;
    color: white;
    font-weight: 500;
    cursor: pointer;
}

.or {
    position: relative;
    width: 100%;
    max-width: 350px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3rem;
    z-index: 2;
}

.or::before {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    content: '';
    height: 1px;
    width: 100%;
    background: #00000011;
    z-index: -1;
}

.or p {
    font-size: 0.7rem;
    padding: 0.5rem;
    background: white;
}

.footer {
    position: absolute;
    bottom: 0;
    font-size: 0.9rem;
}

.footer a {
    color: #2FA634;
}

@media screen and (max-width: 769px) {
    .login {
        background: none;
    }

    .container {
        flex-direction: column;
        height: 90vh;
        box-shadow: none;
        width: 100%;
    }

    .container>* {
        width: 100% !important;
    }

    .container h3 {
        display: none;
    }

    .container .left img {
        width: 200px;
        margin-bottom: 3rem;
    }

    .container .left h4 {
        display: none;
    }

    .container .right .txt-input input {
        font-size: 0.9rem;
        height: 35px;
    }

    .container .right .txt-input .badge {
        height: 35px !important;
    }

    .container .right .flex {
        font-size: 0.8rem;
    }

    .footer {
        position: relative;
        font-size: 0.8rem;
        margin-top: 1rem;
    }
}
</style>