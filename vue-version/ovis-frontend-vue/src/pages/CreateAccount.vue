<template>
  <div :class="styles.login_body">
    <div :class="styles.login_content">
      <img :src="logo" :class="styles.login_logo" alt="Logo" />
      <h1>{{ $t('createAccount.title') }}</h1>

      <input
        :class="styles.login_userinput"
        type="text"
        :placeholder="$t('createAccount.usernamePlaceholder')"
        v-model="username"
      />

      <input
        :class="styles.login_passwordinput"
        type="password"
        :placeholder="$t('createAccount.passwordPlaceholder')"
        v-model="password"
      />

        <input
        :class="styles.login_userinput"
        type="text"
        :placeholder="$t('createAccount.emailPlaceholder')"
        v-model="email"
      />
      <input
        :class="styles.login_userinput"
        type="text"
        :placeholder="$t('createAccount.fullNamePlaceholder')"
        v-model="name"
      />

      <div :class="styles.dobRow">
        <select
          :class="styles.login_userinput"
          v-model="dob.month"
        >
          <option value="">{{ $t('createAccount.month') }}</option>
          <option v-for="(monthName, i) in monthNames" :key="monthName" :value="String(i + 1).padStart(2, '0')">
            {{ $t(`createAccount.months.${monthName.toLowerCase()}`) }}
          </option>
        </select>

        <select
          :class="styles.login_userinput"
          v-model="dob.day"
        >
          <option value="">{{ $t('createAccount.day') }}</option>
          <option v-for="n in 31" :key="n" :value="String(n).padStart(2, '0')">
            {{ n }}
          </option>
        </select>

        <select
          :class="styles.login_userinput"
          v-model="dob.year"
        >
          <option value="">{{ $t('createAccount.year') }}</option>
          <option v-for="n in 100" :key="n" :value="new Date().getFullYear() - n">
            {{ new Date().getFullYear() - n }}
          </option>
        </select>
      </div>

      <select
        :class="styles.login_userinput"
        v-model="sex"
      >
        <option value="male">{{ $t('createAccount.male') }}</option>
        <option value="female">{{ $t('createAccount.female') }}</option>
        <option value="other">{{ $t('createAccount.other') }}</option>
      </select>

      <button 
        :class="styles.login_submit" 
        @click="handleCreate"
        :disabled="loading"
      >
        {{ loading ? $t('createAccount.creatingAccount') : $t('createAccount.createAccountButton') }}
      </button>

      <p v-if="message" :style="{ color: messageColor }">{{ message }}</p>
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
const email = ref('')
const name = ref('')
const dob = ref({ month: '', day: '', year: '' })
const sex = ref('male')
const message = ref('')
const loading = ref(false)
const messageColor = ref('red')

const router = useRouter()

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const handleCreate = async () => {
  if (!dob.value.month || !dob.value.day || !dob.value.year) {
    message.value = "Please select a full date of birth."
    messageColor.value = 'red'
    return
  }

  loading.value = true
  message.value = ''
  const formattedDob = `${dob.value.month}/${dob.value.day}/${dob.value.year}`

  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'https://ovis-backend-mvp.onrender.com'
    const response = await fetch(`${apiUrl}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
        email : email.value,
        full_name: name.value,
        sex: sex.value,
        dob: formattedDob,
      })
    })

    const data = await response.json()

    if (response.ok) {
      message.value = "Account created successfully! Redirecting to login..."
      messageColor.value = 'green'
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/patientlogin")
      }, 1500)
    } else {
      message.value = data.detail || "Account creation failed"
      messageColor.value = 'red'
    }
  } catch (error) {
    console.error("Error:", error)
    message.value = "Network error or backend not running"
    messageColor.value = 'red'
  } finally {
    loading.value = false
  }
}
</script>
