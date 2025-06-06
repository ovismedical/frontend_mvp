<template>
  <div :class="styles.dashboard">
    <!-- Mobile Header with Menu Button -->
    <header :class="styles.mobileHeader">
      <button :class="styles.menuBtn" @click="toggleSidebar">
        <span class="icon icon-md">menu</span>
      </button>
      <h1 :class="styles.mobileTitle">Dashboard</h1>
      <div :class="styles.mobileActions">
        <button :class="styles.notificationBtn">
          <span class="icon icon-md">notifications</span>
          <span :class="styles.badge">5</span>
        </button>
      </div>
    </header>

    <aside :class="styles.sidebar">
      <Sidebar ref="sidebarRef" />
    </aside>

    <main :class="styles.mainContent">
              <!-- Desktop Header with Greeting -->
        <header :class="styles.topHeader">
        <div :class="styles.greetingSection">
          <h1 :class="styles.greeting">
            Good {{ getTimeOfDay() }} <span :class="styles.userName">{{ patient?.name || 'User' }}</span>
          </h1>
          <p :class="styles.date">{{ today }}</p>
        </div>
        
        <div :class="styles.headerActions">
          <button :class="styles.notificationBtn">
            <span class="icon icon-md">notifications</span>
            <span :class="styles.badge">5</span>
          </button>
        </div>
      </header>

      <!-- Alert Message -->
      <div :class="styles.alertMessage" v-if="showAlert">
        <div :class="styles.alertIcon">
          <span class="icon icon-md text-warning-500">warning</span>
        </div>
        <div :class="styles.alertText">
          <strong>Message from Dr. Lee</strong><br>
          Your recent report flagged an issue — <span :class="styles.alertLink">check adjusted medication.</span>
        </div>
        <button :class="styles.alertClose" @click="showAlert = false">
          <span class="icon icon-md">close</span>
        </button>
      </div>

      <!-- Main Content Grid -->
      <section :class="styles.contentGrid">
        <!-- Daily Check In Card -->
        <div :class="[styles.card, styles.dailyCheckCard]">
          <div :class="styles.cardHeader">
            <div :class="styles.cardIcon">
              <span class="icon icon-lg">assignment</span>
            </div>
            <div :class="styles.cardContent">
              <h3>Daily Check In</h3>
              <p :class="styles.cardSubtitle">Quick structured questionnaire</p>
              <button :class="styles.primaryBtn" @click="goToQuiz">
                <span class="icon icon-sm">play_arrow</span>
                Start Quiz
              </button>
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
            <div 
              v-for="(day, index) in weekDays" 
              :key="index" 
              :class="[styles.dayDot, day.completed && styles.completed]"
              :title="`Day ${index + 1}`"
            ></div>
          </div>
        </div>

        <!-- Florence Check In Card -->
        <div :class="[styles.card, styles.florenceCard]">
          <div :class="styles.cardHeader">
            <div :class="styles.cardIcon">
              <span class="icon icon-lg">smart_toy</span>
            </div>
            <div :class="styles.cardContent">
              <h3>Check-in with Florence</h3>
              <p :class="styles.cardSubtitle">Chat with AI nurse about your health</p>
              <button :class="styles.secondaryBtn" @click="goToFlorence">
                <span class="icon icon-sm">chat</span>
                Chat with Florence
              </button>
            </div>
          </div>
          <div :class="styles.florenceInfo">
            <div :class="styles.florenceAvatar">
              <span class="icon icon-lg">health_and_safety</span>
            </div>
            <div :class="styles.florenceText">
              <p>Hi! I'm Florence, your AI nurse. Let's have a friendly chat about how you're feeling today.</p>
              <div :class="styles.featureList">
                <div :class="styles.feature">
                  <span class="icon icon-sm">check_circle</span>
                  <small>Natural conversation</small>
                </div>
                <div :class="styles.feature">
                  <span class="icon icon-sm">check_circle</span>
                  <small>Voice or text support</small>
                </div>
                <div :class="styles.feature">
                  <span class="icon icon-sm">check_circle</span>
                  <small>Personalized assessment</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Personal Data Card -->
        <div :class="[styles.card, styles.personalCard]">
          <div :class="styles.cardHeader">
            <div :class="styles.cardIcon">
              <span class="icon icon-lg">person</span>
            </div>
            <div :class="styles.cardContent">
              <h3>Personal Information</h3>
            </div>
          </div>
          <template v-if="patient">
            <div :class="styles.infoGrid">
              <div :class="styles.infoRow">
                <span :class="styles.infoLabel">Name:</span>
                <span :class="styles.infoValue">{{ patient.name }}</span>
              </div>
              <div :class="styles.infoRow">
                <span :class="styles.infoLabel">Date of Birth:</span>
                <span :class="styles.infoValue">{{ patient.dob }}</span>
              </div>
              <div :class="styles.infoRow">
                <span :class="styles.infoLabel">Sex:</span>
                <span :class="styles.infoValue">{{ patient.sex }}</span>
              </div>
            </div>
          </template>
          <div v-else :class="styles.loading">
            <span class="icon icon-md">hourglass_empty</span>
            <span>Loading...</span>
          </div>
        </div>

        <!-- Wellness Score Card -->
        <div :class="[styles.card, styles.wellnessCard]">
          <div :class="styles.cardHeader">
            <div :class="styles.cardIcon">
              <span class="icon icon-lg">analytics</span>
            </div>
            <div :class="styles.cardContent">
              <div :class="styles.scoreHeader">
                <span :class="styles.scoreNumber">82.5</span>
                <span :class="styles.scoreLabel">Wellness Score</span>
              </div>
              <select :class="styles.periodSelect">
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
          </div>
          <div :class="styles.chartContainer">
            <div :class="styles.chart">
              <div 
                v-for="(bar, index) in chartData" 
                :key="index" 
                :class="styles.chartBar" 
                :style="{ height: bar.height + '%' }"
                :title="`Day ${index + 1}: ${bar.height}%`"
              ></div>
            </div>
            <div :class="styles.chartLabels">
              <span v-for="label in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="label">{{ label }}</span>
            </div>
          </div>
          <div :class="styles.scoreStats">
            <div :class="styles.statItem">
              <span class="icon icon-sm text-error-500">trending_down</span>
              <span :class="styles.changeDown">-12% vs last week</span>
            </div>
            <div :class="styles.statItem">
              <span class="icon icon-sm text-warning-500">lightbulb</span>
              <span :class="styles.insights">8 insights</span>
            </div>
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
const sidebarRef = ref(null)

const patient = ref(null)
const currentStreak = ref(3)
const showAlert = ref(true)

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true
})

const getTimeOfDay = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Morning'
  if (hour < 17) return 'Afternoon'
  return 'Evening'
}

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

const toggleSidebar = () => {
  if (sidebarRef.value) {
    sidebarRef.value.toggle()
  }
}

const fetchPatient = async () => {
  try {
    const storedToken = JSON.parse(localStorage.getItem('token')).access_token
    const response = await fetch('http://localhost:8000/userinfo', {
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
  } catch (error) {
    console.error(error)
  }
}

const goToQuiz = () => {
  router.push('/quiz')
}

const goToFlorence = () => {
  router.push('/florence')
}

onMounted(() => {
  fetchPatient()
})
</script>
