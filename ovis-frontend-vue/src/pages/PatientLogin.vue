<template>
  <div :class="styles.login_body">
    <div :class="styles.login_content">
      <img :src="logo" :class="styles.login_logo" alt="Logo" />
      <h1>{{ $t('login.patientLogin') }}</h1>

      <input
        :class="styles.login_userinput"
        type="text"
        :placeholder="$t('login.usernamePlaceholder')"
        v-model="username"
      />

      <input
        :class="styles.login_passwordinput"
        type="password"
        :placeholder="$t('login.passwordPlaceholder')"
        v-model="password"
      />

      <button
        :class="styles.login_submit"
        @click="handleLogin"
        :disabled="loading"
      >
        {{ loading ? $t('login.loggingIn') : $t('login.enter') }}
      </button>

      <button :class="styles.login_createAccount" @click="goToCreateAccount">
        {{ $t('login.createAccount') }}
      </button>

      <p v-if="message" :class="styles.login_message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import logo from '../assets/logo.png'
import styles from './login.module.css'

const apiUrl = import.meta.env.VITE_API_URL

const username = ref('')
const password = ref('')
const message = ref('')
const loading = ref(false)

const router = useRouter()

const handleLogin = async () => {
  loading.value = true
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'https://ovis-backend-mvp.onrender.com'
    const response = await fetch(`${apiUrl}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        username: username.value,
        password: password.value,
      }),
    })

    const data = await response.json()
    
    if (data.details === 'Invalid credentials') {
      message.value = 'Login failed. Please check your username or password.'
    } else{
      localStorage.setItem('token', JSON.stringify(data))
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Login error:', error)
    message.value = 'Unable to connect to server.'
  } finally {
    loading.value = false
  }
}

const goToCreateAccount = () => {
  router.push('/createaccount')
}
</script>
