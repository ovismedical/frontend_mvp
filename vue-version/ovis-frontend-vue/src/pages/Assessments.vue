<template>
  <div :class="styles.assessments">
    <aside :class="styles.sidebar">
      <Sidebar />
    </aside>

    <main :class="styles.mainContent">
      <!-- Modern Header -->
      <header :class="styles.topHeader">
        <div :class="styles.headerContent">
          <h1 :class="styles.pageTitle">My Assessments</h1>
          <p :class="styles.pageSubtitle">View all your health check-ins and conversations with Florence</p>
        </div>
        <div :class="styles.statsBar">
          <div :class="styles.statItem">
            <span :class="styles.statNumber">{{ totalAssessments }}</span>
            <span :class="styles.statLabel">Total</span>
          </div>
          <div :class="styles.statItem">
            <span :class="styles.statNumber">{{ dailyCheckins }}</span>
            <span :class="styles.statLabel">Daily Check-ins</span>
          </div>
          <div :class="styles.statItem">
            <span :class="styles.statNumber">{{ florenceConversations }}</span>
            <span :class="styles.statLabel">Florence Chats</span>
          </div>
        </div>
      </header>

      <!-- Filter Tabs -->
      <div :class="styles.filterTabs">
        <button 
          :class="[styles.filterTab, activeFilter === 'all' && styles.activeTab]"
          @click="setFilter('all')"
        >
          <i class="fas fa-list"></i>
          All Assessments
        </button>
        <button 
          :class="[styles.filterTab, activeFilter === 'daily_checkin' && styles.activeTab]"
          @click="setFilter('daily_checkin')"
        >
          <i class="fas fa-clipboard-check"></i>
          Daily Check-ins
        </button>
        <button 
          :class="[styles.filterTab, activeFilter === 'florence_conversation' && styles.activeTab]"
          @click="setFilter('florence_conversation')"
        >
          <i class="fas fa-robot"></i>
          Florence Conversations
        </button>
        <button 
          :class="[styles.filterTab, activeFilter === 'weekly' && styles.activeTab]"
          @click="goToWeeklyView()"
        >
          <i class="fas fa-chart-line"></i>
          Weekly Analytics
        </button>
        <button 
          :class="[styles.filterTab, activeFilter === 'monthly' && styles.activeTab]"
          @click="goToMonthlyView()"
        >
          <i class="fas fa-calendar-alt"></i>
          Monthly Analytics
        </button>
      </div>

      <!-- Assessment List -->
      <div :class="styles.assessmentList">
        <div v-if="loading" :class="styles.loading">
          <i class="fas fa-spinner fa-spin"></i>
          Loading assessments...
        </div>

        <div v-else-if="filteredAssessments.length === 0" :class="styles.emptyState">
          <i class="fas fa-clipboard-list"></i>
          <h3>No assessments found</h3>
          <p>Complete your first health check-in or chat with Florence to get started!</p>
          <div :class="styles.actionButtons">
            <button :class="styles.primaryBtn" @click="goToCheckin">
              <i class="fas fa-clipboard-check"></i>
              Daily Check-in
            </button>
            <button :class="styles.secondaryBtn" @click="goToFlorence">
              <i class="fas fa-robot"></i>
              Chat with Florence
            </button>
          </div>
        </div>

        <div v-else>
          <div 
            v-for="assessment in filteredAssessments" 
            :key="assessment.id"
            :class="styles.assessmentCard"
            @click="viewAssessment(assessment)"
          >
            <div :class="styles.cardHeader">
              <div :class="styles.cardIcon" :style="{ background: getIconColor(assessment) }">
                <i :class="['fas', assessment.icon]"></i>
              </div>
              <div :class="styles.cardInfo">
                <h3 :class="styles.cardTitle">{{ assessment.title }}</h3>
                <p :class="styles.cardDate">{{ formatDate(assessment.date) }}</p>
              </div>
              <div :class="styles.cardBadge" :style="{ background: assessment.color }">
                {{ assessment.type === 'daily_checkin' ? 'Questionnaire' : 'AI Chat' }}
              </div>
            </div>
            <div :class="styles.cardContent">
              <p :class="styles.cardSummary">{{ assessment.summary }}</p>
              <div :class="styles.cardStats" v-if="assessment.type === 'daily_checkin'">
                <span :class="styles.statPill">
                  <i class="fas fa-check-circle"></i>
                  {{ assessment.data.questions_answered }} questions
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from './Sidebar.vue'
import styles from './Assessments.module.css'

const apiUrl = import.meta.env.VITE_API_URL

const router = useRouter()
const loading = ref(true)
const assessments = ref([])
const activeFilter = ref('all')

const totalAssessments = computed(() => assessments.value.length)
const dailyCheckins = computed(() => assessments.value.filter(a => a.type === 'daily_checkin').length)
const florenceConversations = computed(() => assessments.value.filter(a => a.type === 'florence_conversation').length)

const filteredAssessments = computed(() => {
  if (activeFilter.value === 'all') {
    return assessments.value
  }
  return assessments.value.filter(a => a.type === activeFilter.value)
})

const setFilter = (filter) => {
  activeFilter.value = filter
}

const getIconColor = (assessment) => {
  // For Florence conversations, use oncologist notification level for color
  if (assessment.type === 'florence_conversation' && assessment.oncologist_notification_level) {
    switch (assessment.oncologist_notification_level) {
      case 'red':
        return '#ef4444' // Red for urgent
      case 'amber':
        return '#f59e0b' // Amber/orange for caution
      case 'none':
      default:
        return '#22c55e' // Green for normal/no alerts
    }
  }
  // For daily check-ins, use original color
  return assessment.color
}

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'Unknown date'
  }
}

const goToCheckin = () => {
  router.push('/quiz')
}

const goToFlorence = () => {
  router.push('/florence')
}

const goToWeeklyView = () => {
  router.push('/weekly-analytics')
}

const goToMonthlyView = () => {
  router.push('/monthly-analytics')
}

const viewAssessment = (assessment) => {
  if (assessment.type === 'florence_conversation') {
    // Navigate to detailed Florence assessment view
    router.push(`/assessment/${assessment.id}`)
  } else {
    // For daily check-ins, show a simple summary for now
    // TODO: Implement daily check-in detailed view
    console.log('Daily check-in assessment:', assessment)
    alert(`Daily Check-in completed on ${formatDate(assessment.date)}\n${assessment.data.questions_answered} questions answered`)
  }
}

const fetchAssessments = async () => {
  try {
    loading.value = true
    const token = JSON.parse(localStorage.getItem('token')).access_token
    const apiUrl = import.meta.env.VITE_API_URL || 'https://ovis-backend-mvp.onrender.com'
    
    const response = await fetch(`${apiUrl}/unified_assessments`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      assessments.value = data.assessments || []
    } else {
      console.error('Failed to fetch assessments:', response.statusText)
    }
  } catch (error) {
    console.error('Error fetching assessments:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAssessments()
})
</script> 