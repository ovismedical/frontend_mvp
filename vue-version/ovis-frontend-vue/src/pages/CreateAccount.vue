<template>
  <div :class="styles.login_body">
    <div :class="styles.login_content">
      <img :src="logo" :class="styles.login_logo" alt="Logo" />
      <h1>Create Patient Account</h1>

      <input
        :class="styles.login_userinput"
        type="text"
        placeholder="Username / Patient ID"
        v-model="username"
      />

      <input
        :class="styles.login_passwordinput"
        type="password"
        placeholder="Password"
        v-model="password"
      />

      <input
        :class="styles.login_userinput"
        type="text"
        placeholder="Full Name"
        v-model="name"
      />

      <input
        :class="styles.login_userinput"
        type="text"
        placeholder="Hospital"
        v-model="hospital"
      />

      <input
        :class="styles.login_userinput"
        type="text"
        placeholder="Doctor"
        v-model="doctor"
      />

      <!-- Date of Birth Dropdowns -->
      <div :class="styles.dob_row">
        <select
          :class="styles.login_userinput"
          v-model="dob.month"
        >
          <option value="">Month</option>
          <option v-for="(monthName, i) in monthNames" :key="monthName" :value="String(i + 1).padStart(2, '0')">
            {{ monthName }}
          </option>
        </select>

        <select
          :class="styles.login_userinput"
          v-model="dob.day"
        >
          <option value="">Day</option>
          <option v-for="day in 31" :key="day" :value="String(day).padStart(2, '0')">
            {{ day }}
          </option>
        </select>

        <select
          :class="styles.login_userinput"
          v-model="dob.year"
        >
          <option value="">Year</option>
          <option v-for="year in years" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>

      <select
        :class="styles.login_userinput"
        v-model="sex"
      >
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      <button
        :class="styles.login_submit"
        @click="handleCreate"
        :disabled="loading"
      >
        {{ loading ? 'Creating Account...' : 'Create Account' }}
      </button>

      <button :class="styles.login_createAccount" @click="goToLogin">
        Back to Login
      </button>

      <p v-if="message" style="color: red;">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import logo from '../assets/logo.png'
import styles from './login.module.css'

const username = ref('')
const password = ref('')
const name = ref('')
const hospital = ref('')
const doctor = ref('')
const dob = ref({ month: '', day: '', year: '' })
const sex = ref('male')
const message = ref('')
const loading = ref(false)

const router = useRouter()

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const years = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 100 }, (_, i) => currentYear - i)
})

const handleCreate = async () => {
  if (!dob.value.month || !dob.value.day || !dob.value.year) {
    message.value = 'Please select a full date of birth.'
    return
  }

  const formattedDob = `${dob.value.month}/${dob.value.day}/${dob.value.year}`

  loading.value = true
  try {
    const response = await fetch('http://localhost:8000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
        full_name: name.value,
        email: `${username.value}@example.com`, // Backend requires email, using username as fallback
        sex: sex.value,
        dob: formattedDob,
        hospital: hospital.value,
        doctor: doctor.value,
      }),
    })

    const data = await response.json()
    
    if (response.ok) {
      message.value = 'Account created successfully! Redirecting to login...'
      setTimeout(() => {
        router.push('/patientlogin')
      }, 2000)
    } else {
      message.value = data.detail || 'Account creation failed'
    }
  } catch (error) {
    console.error('Error:', error)
    message.value = 'Network error or backend not running'
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/patientlogin')
}
</script> 