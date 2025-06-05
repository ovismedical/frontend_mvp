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
        placeholder="Email"
        v-model="email"
      />
      <input
        :class="styles.login_userinput"
        type="text"
        placeholder="Full Name"
        v-model="name"
      />

      <div :class="styles.dobRow">
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
          <option v-for="n in 31" :key="n" :value="String(n).padStart(2, '0')">
            {{ n }}
          </option>
        </select>

        <select
          :class="styles.login_userinput"
          v-model="dob.year"
        >
          <option value="">Year</option>
          <option v-for="n in 100" :key="n" :value="new Date().getFullYear() - n">
            {{ new Date().getFullYear() - n }}
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

      <button :class="styles.login_submit" @click="handleCreate">
        Create Account
      </button>

      <p v-if="message" style="color: red">{{ message }}</p>
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
const email = ref('')
const name = ref('')
const dob = ref({ month: '', day: '', year: '' })
const sex = ref('male')
const message = ref('')

const router = useRouter()

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const handleCreate = async () => {
  if (!dob.value.month || !dob.value.day || !dob.value.year) {
    message.value = "Please select a full date of birth."
    return
  }

  const formattedDob = `${dob.value.month}/${dob.value.day}/${dob.value.year}`

  try {
    const response = await fetch("${apiUrl}/register", {
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
      router.push("/patientlogin")
    } else {
      message.value = data.detail || "Account creation failed"
    }
  } catch (error) {
    console.error("Error:", error)
    message.value = "Network error or backend not running"
  }
}
</script>
