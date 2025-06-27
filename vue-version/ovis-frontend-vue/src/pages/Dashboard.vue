<template>
  <div :class="styles.dashboard">
    <aside :class="styles.sidebar">
      <Sidebar />
    </aside>

    <main :class="styles.mainContent">
      <!-- Modern Header with Greeting -->
      <header :class="styles.topHeader">
        <div :class="styles.greetingSection">
          <h1 :class="styles.greeting">
            Good Morning <span :class="styles.userName">{{ patient?.name || 'User' }}</span>
          </h1>
          <p :class="styles.date">{{ today }}</p>
        </div>
        
        <div :class="styles.headerActions">
          <div :class="styles.iconWithBadge">
            <i class="fas fa-bell"></i>
            <span :class="styles.badgeRed">5</span>
          </div>
        </div>
      </header>

      <!-- Alert Message -->
      <div :class="styles.alertMessage">
        <div :class="styles.alertIcon">⚠️</div>
        <div :class="styles.alertText">
          <strong>Message from Dr. Lee</strong><br>
          Your recent report flagged an issue — <span :class="styles.alertLink">check adjusted medication.</span>
        </div>
        <button :class="styles.alertClose">×</button>
      </div>

      <!-- Main Content Grid -->
      <section :class="styles.contentGrid">
        <!-- Daily Check In Card -->
        <div :class="[styles.card, styles.dailyCheckCard]">
          <div :class="styles.cardHeader">
            <div :class="styles.cardIcon">📊</div>
            <div>
              <h3>Daily Check In</h3>
              <p :class="styles.cardSubtitle">Quick structured questionnaire</p>
              <button :class="styles.logTodayBtn" @click="goToQuiz">Start Quiz</button>
            </div>
          </div>
          <div :class="styles.streakInfo">
            <div :class="styles.streakNumber">{{ currentStreak < 10 ? '0' + currentStreak : currentStreak }}</div>
            <div :class="styles.streakText">
              <span>days</span><br>
              <small>You've started strong.</small>
            </div>
          </div>
          <div :class="styles.weekDays">
            <div v-for="(day, index) in weekDays" :key="index" :class="[styles.dayDot, day.completed && styles.completed]"></div>
          </div>
        </div>

        <!-- Florence Check In Card -->
        <div :class="[styles.card, styles.florenceCard]">
          <div :class="styles.cardHeader">
            <div :class="styles.cardIcon">🤖</div>
            <div>
              <h3>Check-in with Florence</h3>
              <p :class="styles.cardSubtitle">Chat with AI nurse about your health</p>
              <button :class="styles.florenceBtn" @click="goToFlorence">Chat with Florence</button>
            </div>
          </div>
          <div :class="styles.florenceInfo">
            <div :class="styles.florenceAvatar">
              <span>👩‍⚕️</span>
            </div>
            <div :class="styles.florenceText">
              <p>Hi! I'm Florence, your AI nurse. Let's have a friendly chat about how you're feeling today.</p>
              <small>• Natural conversation</small><br>
              <small>• Voice or text support</small><br>
              <small>• Personalized assessment</small>
            </div>
          </div>
        </div>

        <!-- Personal Data Card -->
        <div :class="[styles.card, styles.personalCard]">
          <h3>Personal Information</h3>
          <template v-if="patient">
            <div :class="styles.infoRow">
              <span>Name:</span>
              <span>{{ patient.name }}</span>
            </div>
            <div :class="styles.infoRow">
              <span>Date of Birth:</span>
              <span>{{ patient.dob }}</span>
            </div>
            <div :class="styles.infoRow">
              <span>Sex:</span>
              <span>{{ patient.sex }}</span>
            </div>
          </template>
          <p v-else :class="styles.loading">Loading...</p>
        </div>

        <!-- Wellness Score Card -->
        <div :class="[styles.card, styles.wellnessCard]">
          <div :class="styles.cardHeader">
            <div>
              <div :class="styles.scoreHeader">
                <span :class="styles.starIcon">⭐</span>
                <span :class="styles.scoreNumber">82.5</span>
                <select :class="styles.periodSelect">
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
              <p>Your Wellness Score</p>
            </div>
          </div>
          <div :class="styles.chartContainer">
            <div :class="styles.chart">
              <div v-for="(bar, index) in chartData" :key="index" :class="styles.chartBar" :style="{ height: bar.height + '%' }"></div>
            </div>
            <div :class="styles.chartLabels">
              <span v-for="label in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="label">{{ label }}</span>
            </div>
          </div>
          <div :class="styles.scoreStats">
            <span :class="styles.changeDown">-12% vs last week</span>
            <span :class="styles.insights">💡 8 insights</span>
          </div>
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

const apiUrl = import.meta.env.VITE_API_URL

const router = useRouter()

const patient = ref(null)
const currentStreak = ref(0)
const rewardInterval = 5

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true
})

// Mock data for the new design
const weekDays = ref([
  { completed: false },
  { completed: true },
  { completed: true },
  { completed: true },
  { completed: false },
  { completed: false },
  { completed: false }
])

const chartData = ref([
  { height: 30 },
  { height: 45 },
  { height: 60 },
  { height: 35 },
  { height: 80 },
  { height: 95 },
  { height: 70 }
])

const fetchPatient = async () => {
  try {
    const storedToken = JSON.parse(localStorage.getItem('token')).access_token
    const response = await fetch('http://0.0.0.0:8000/userinfo', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${storedToken}`
      }
    })

    const data = await response.json()
    patient.value = {
      name: data.full_name,
      dob: data.dob,
      sex: data.sex,
      username: data.username
    }
  }catch (error) {
    console.error(error)
  }
}

const fetchStreak = async () => {
  try {
    const storedToken = JSON.parse(localStorage.getItem('token')).access_token
    const response = await fetch('http://0.0.0.0:8000/getstreak', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${storedToken}`
      }
    })
    const data = await response.json()
    currentStreak.value = data.streak

    } catch (err) {
    console.error('Failed to load streak', err)
  }
}

onMounted(async () => {
  await fetchPatient()
  await fetchStreak()
})

const goToQuiz = () => {
  router.push('/quiz')
}

const goToFlorence = () => {
  router.push('/florence')
}

const signOut = () => {
  localStorage.removeItem('token')
  window.location.href = '/patientlogin'
}
</script>
