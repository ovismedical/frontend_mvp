<template>
  <div :class="styles.dashboard">
    <!-- Mobile Header with Menu Button -->
    <header :class="styles.mobileHeader">
      <button :class="styles.menuBtn" @click="toggleSidebar">
        <span class="icon icon-md">menu</span>
      </button>
      <h1 :class="styles.mobileTitle">{{ $t('dashboard.title') }}</h1>
              <div :class="styles.mobileActions">
          <select v-model="currentLanguage" @change="changeLanguage" style="padding: 0.5rem; margin-right: 0.5rem; border-radius: 0.375rem; border: 1px solid #e2e8f0;">
            <option value="en">English</option>
            <option value="zh-HK">繁體中文</option>
          </select>
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
            {{ $t('dashboard.greeting', { timeOfDay: $t(`timeOfDay.${getTimeOfDay().toLowerCase()}`) }) }} <span :class="styles.userName">{{ patient?.name || 'User' }}</span>
          </h1>
          <p :class="styles.date">{{ today }}</p>
        </div>
        
        <div :class="styles.headerActions">
          <select v-model="currentLanguage" @change="changeLanguage" style="padding: 0.5rem; margin-right: 0.5rem; border-radius: 0.375rem; border: 1px solid #e2e8f0;">
            <option value="en">English</option>
            <option value="zh-HK">繁體中文</option>
          </select>
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
          <strong>{{ $t('dashboard.alertDoctorMessage') }}</strong><br>
          {{ $t('dashboard.alertText') }}
        </div>
        <button :class="styles.alertClose" @click="showAlert = false">
          <span class="icon icon-md">close</span>
        </button>
      </div>

      <!-- Main Content Grid -->
      <section :class="styles.contentGrid">
        <!-- Florence Check In Card - Hero Feature -->
        <div :class="[styles.card, styles.florenceCard, styles.heroCard]">
          <div :class="styles.cardHeader">
            <div :class="[styles.cardIcon, styles.heroIcon]">
              <span class="icon icon-lg">smart_toy</span>
            </div>
            <div :class="styles.cardContent">
              <h3>{{ $t('dashboard.florenceTitle') }}</h3>
              <p :class="styles.cardSubtitle">{{ $t('dashboard.florenceSubtitle') }}</p>
              <div :class="styles.heroFeatures">
                <div :class="styles.heroFeature">
                  <span class="icon icon-sm">psychology</span>
                  <small>{{ $t('dashboard.smartHealthAssessment') }}</small>
                </div>
                <div :class="styles.heroFeature">
                  <span class="icon icon-sm">mic</span>
                  <small>{{ $t('dashboard.voiceTextSupport') }}</small>
                </div>
                <div :class="styles.heroFeature">
                  <span class="icon icon-sm">schedule</span>
                  <small>{{ $t('dashboard.available247') }}</small>
                </div>
              </div>
              <button :class="[styles.primaryBtn, styles.heroBtn]" @click="goToFlorence">
                <span class="icon icon-sm">chat</span>
                {{ $t('dashboard.startConversation') }}
              </button>
            </div>
          </div>
          <div :class="styles.florenceInfo">
            <div :class="styles.florenceAvatar">
              <span class="icon icon-lg">health_and_safety</span>
            </div>
            <div :class="styles.florenceText">
              <p>{{ $t('dashboard.florenceGreeting') }}</p>
              <div :class="styles.featureList">
                <div :class="styles.feature">
                  <span class="icon icon-sm">check_circle</span>
                  <small>{{ $t('dashboard.naturalConversation') }}</small>
                </div>
                <div :class="styles.feature">
                  <span class="icon icon-sm">check_circle</span>
                  <small>{{ $t('dashboard.personalizedCare') }}</small>
                </div>
                <div :class="styles.feature">
                  <span class="icon icon-sm">check_circle</span>
                  <small>{{ $t('dashboard.immediateSupport') }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Daily Check In Card -->
        <div :class="[styles.card, styles.dailyCheckCard, styles.maintenanceCard]">
          <div :class="styles.cardHeader">
            <div :class="[styles.cardIcon, styles.disabledIcon]">
              <span class="icon icon-lg">assignment</span>
            </div>
            <div :class="styles.cardContent">
              <h3>{{ $t('dashboard.dailyCheckIn') }}</h3>
              <p :class="styles.cardSubtitle">{{ $t('dashboard.dailyCheckSubtitle') }}</p>
              <div :class="styles.maintenanceBadge">
                <span class="icon icon-sm">construction</span>
                {{ $t('dashboard.underMaintenance') }}
              </div>
              <button :class="[styles.primaryBtn, styles.disabledBtn]" disabled>
                <span class="icon icon-sm">play_arrow</span>
                {{ $t('dashboard.startQuiz') }}
              </button>
            </div>
          </div>
          <div :class="[styles.streakInfo, styles.disabledContent]">
            <div :class="styles.streakNumber">{{ currentStreak < 10 ? '0' + currentStreak : currentStreak }}</div>
            <div :class="styles.streakText">
              <span>{{ $t('dashboard.streakDays') }}</span><br>
              <small>{{ $t('dashboard.streakMessage') }}</small>
            </div>
          </div>
          <div :class="styles.weekDays">
            <div 
              v-for="(day, index) in weekDays" 
              :key="index" 
              :class="[styles.dayDot, day.completed && styles.completed, styles.disabledDot]"
              :title="`Day ${index + 1}`"
            ></div>
          </div>
        </div>

        <!-- Personal Data Card -->
        <div :class="[styles.card, styles.personalCard]">
          <div :class="styles.cardHeader">
            <div :class="styles.cardIcon">
              <span class="icon icon-lg">person</span>
            </div>
            <div :class="styles.cardContent">
              <h3>{{ $t('dashboard.personalInfo') }}</h3>
            </div>
          </div>
          <template v-if="patient">
            <div :class="styles.infoGrid">
              <div :class="styles.infoRow">
                <span :class="styles.infoLabel">{{ $t('common.name') }}:</span>
                <span :class="styles.infoValue">{{ patient.name }}</span>
              </div>
              <div :class="styles.infoRow">
                <span :class="styles.infoLabel">{{ $t('common.dateOfBirth') }}:</span>
                <span :class="styles.infoValue">{{ patient.dob }}</span>
              </div>
              <div :class="styles.infoRow">
                <span :class="styles.infoLabel">{{ $t('common.sex') }}:</span>
                <span :class="styles.infoValue">{{ patient.sex }}</span>
              </div>
            </div>
          </template>
          <div v-else :class="styles.loading">
            <span class="icon icon-md">hourglass_empty</span>
            <span>{{ $t('common.loading') }}</span>
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
                <span :class="styles.scoreLabel">{{ $t('dashboard.wellnessScore') }}</span>
              </div>
              <select :class="styles.periodSelect">
                <option>{{ $t('common.weekly') }}</option>
                <option>{{ $t('common.monthly') }}</option>
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
              <span v-for="day in dayLabels" :key="day">{{ $t(`days.${day}`) }}</span>
            </div>
          </div>
          <div :class="styles.scoreStats">
            <div :class="styles.statItem">
              <span class="icon icon-sm text-error-500">trending_down</span>
              <span :class="styles.changeDown">-12% {{ $t('dashboard.changeDown') }}</span>
            </div>
            <div :class="styles.statItem">
              <span class="icon icon-sm text-warning-500">lightbulb</span>
              <span :class="styles.insights">8 {{ $t('dashboard.insights') }}</span>
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

// Simple language switching without useI18n composable
const currentLanguage = ref(localStorage.getItem('language') || 'en')

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

const dayLabels = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const changeLanguage = () => {
  localStorage.setItem('language', currentLanguage.value)
  // Force page reload to apply language change
  window.location.reload()
}

const toggleSidebar = () => {
  if (sidebarRef.value) {
    sidebarRef.value.toggle()
  }
}

const fetchPatient = async () => {
  try {
    const storedToken = JSON.parse(localStorage.getItem('token')).access_token
    const baseUrl = apiUrl || 'https://ovis-backend-mvp.onrender.com'
    const response = await fetch(`${baseUrl}/userinfo`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${storedToken}`
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    patient.value = {
      name: data.full_name,
      dob: data.dob,
      sex: data.sex,
      username: data.username
    }
  } catch (error) {
    console.error('Failed to fetch patient data:', error)
    // Set patient to empty object to stop loading state
    patient.value = {
      name: 'Unable to load',
      dob: 'Unable to load', 
      sex: 'Unable to load',
      username: 'Unable to load'
    }
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
