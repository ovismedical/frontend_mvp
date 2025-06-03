<template>
  <div :class="styles.dashboard">
    <aside :class="styles.sidebar">
      <Sidebar />
    </aside>

    <main :class="styles.mainContent">
        <header :class="styles.topHeader">
            <div :class="styles.headerActions">
                <div :class="styles.iconWithBadge">
                <i class="fas fa-bell"></i>
                <span :class="styles.badgeRed">5</span>
                </div>

                <div :class="styles.iconWithBadge">
                <i class="fas fa-comment-dots"></i>
                <span :class="styles.badgeGreen">3</span>
                </div>

                <div :class="styles.profileDropdown">
                <img :src="userAvatar" :class="styles.avatar" />
                <span>{{ userName }}</span>
                <button @click="signOut">▼</button>
                </div>
            </div>
        </header>


      <section :class="styles.contentGrid">
        <div :class="[styles.card, styles.personalBox]">
          <h2>Personal Data</h2>
          <template v-if="patient">
            <p><strong>Name:</strong> {{ patient.name }}</p>
            <p><strong>DoB:</strong> {{ patient.dob }}</p>
            <p><strong>Sex:</strong> {{ patient.sex }}</p>
          </template>
          <p v-else>Loading...</p>
        </div>

        <div :class="[styles.card, styles.streakBox]">
          <h2>Current Streak</h2>
          <p> {{ currentStreak }} day{{ currentStreak === 1 ? '' : 's' }}</p>
          <div :class="styles.progressBarContainer">
            <div
              :class="styles.progressBarFill"
              :style="{ width: getProgressPercent(currentStreak) + '%' }"
            ></div>
          </div>
          <p>{{ getDaysToNextReward(currentStreak) }} day{{ getDaysToNextReward(currentStreak) !== 1 ? 's' : '' }} to next reward</p>
        </div>

        <div :class="[styles.card, styles.loggerBox]">
          <h2>Daily Logger</h2>
          <p>{{ today }}</p>
          <button @click="goToQuiz">Begin</button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import logo from '../assets/logo.png'
import Sidebar from './Sidebar.vue'
import styles from './dashboard.module.css'

const router = useRouter()

const patient = ref(null)
const currentStreak = ref(0)
const rewardInterval = 5

const today = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

const fetchPatient = async () => {
  try {
    const token = JSON.parse(localStorage.getItem('token'))
    const response = await fetch(`http://127.0.0.1:8000/personalinfo?username=${token.name}`)
    const data = await response.json()
    patient.value = data
  } catch (err) {
    console.error('Failed to load patient data', err)
  }
}

const fetchStreak = async () => {
  try {
    const token = JSON.parse(localStorage.getItem('token'))
    const response = await fetch(`http://127.0.0.1:8000/getstreak?username=${token.name}`)
    const data = await response.json()
    currentStreak.value = data
  } catch (err) {
    console.error('Failed to load streak', err)
  }
}

onMounted(() => {
  fetchPatient()
  fetchStreak()
})

const getProgressPercent = (count) => {
  const progress = count % rewardInterval
  return (progress / rewardInterval) * 100
}

const getDaysToNextReward = (count) => {
  const remaining = rewardInterval - (count % rewardInterval)
  return remaining === rewardInterval ? 0 : remaining
}

const goToQuiz = () => {
  router.push('/quiz')
}

const userName = 'John Doe'
const userAvatar = 'https://via.placeholder.com/40' // replace with your own image

const signOut = () => {
  // Clear token and redirect to login
  localStorage.removeItem('token')
  window.location.href = '/patientlogin'
}

</script>
