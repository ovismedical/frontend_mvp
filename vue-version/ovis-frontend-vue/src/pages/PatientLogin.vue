<template>
  <div :class="styles.login_body">
    <div :class="styles.login_content">
      <img :src="logo" :class="styles.login_logo" alt="Logo" />
      <h1>Patient Login</h1>

      <input
        :class="styles.login_userinput"
        type="text"
        placeholder="Username/Patient ID"
        v-model="username"
      />

      <input
        :class="styles.login_passwordinput"
        type="password"
        placeholder="Password"
        v-model="password"
      />

      <button
        :class="styles.login_submit"
        @click="handleLogin"
        :disabled="loading"
      >
        {{ loading ? 'Logging in...' : 'Enter' }}
      </button>

      <button :class="styles.login_createAccount" @click="goToCreateAccount">
        Create Account
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

const username = ref('')
const password = ref('')
const message = ref('')
const loading = ref(false)

const router = useRouter()

const handleLogin = async () => {
  loading.value = true
  try {
    const response = await fetch('http://127.0.0.1:8000/patient-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value }),
    })

    const data = await response.json()

    if (data.message === 'Invalid credentials') {
      message.value = 'Login failed. Please check your username or password.'
    } else if (data.message === 'Patient login successful') {
      localStorage.setItem('token', JSON.stringify(data.token))
      router.push('/dashboard')
    } else {
      message.value = 'An unexpected error occurred.'
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
