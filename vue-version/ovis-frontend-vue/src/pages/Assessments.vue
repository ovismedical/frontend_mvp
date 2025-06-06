<template>
  <div :class="styles.assessments">
    <!-- Mobile Header -->
    <header :class="styles.mobileHeader">
      <button 
        :class="styles.menuButton" 
        @click="toggleSidebar"
        aria-label="Toggle menu"
      >
        <span class="material-icons">menu</span>
      </button>
      <h1 :class="styles.mobileTitle">My Assessments</h1>
    </header>

    <!-- Sidebar -->
    <aside :class="[styles.sidebar, isSidebarOpen && styles.sidebarOpen]">
      <Sidebar />
    </aside>

    <!-- Sidebar Overlay -->
    <div 
      v-if="isSidebarOpen" 
      :class="styles.sidebarOverlay" 
      @click="closeSidebar"
    ></div>

    <!-- Main Content -->
    <main :class="styles.mainContent">
      <!-- Desktop Header -->
      <header :class="styles.desktopHeader">
        <div :class="styles.headerContent">
          <h1 :class="styles.pageTitle">My Assessments</h1>
          <p :class="styles.pageSubtitle">View all your health check-ins and conversations with Florence</p>
        </div>
        <div :class="styles.statsBar">
          <div :class="styles.statCard">
            <span :class="styles.statNumber">{{ totalAssessments }}</span>
            <span :class="styles.statLabel">Total</span>
          </div>
          <div :class="styles.statCard">
            <span :class="styles.statNumber">{{ dailyCheckins }}</span>
            <span :class="styles.statLabel">Daily Check-ins</span>
          </div>
          <div :class="styles.statCard">
            <span :class="styles.statNumber">{{ florenceConversations }}</span>
            <span :class="styles.statLabel">Florence Chats</span>
          </div>
        </div>
      </header>

      <!-- Filter Tabs -->
      <div :class="styles.filterContainer">
        <div :class="styles.filterTabs">
          <button 
            :class="[styles.filterTab, activeFilter === 'all' && styles.activeTab]"
            @click="setFilter('all')"
          >
            <span class="material-icons">view_list</span>
            <span :class="styles.tabText">All</span>
          </button>
          <button 
            :class="[styles.filterTab, activeFilter === 'daily_checkin' && styles.activeTab]"
            @click="setFilter('daily_checkin')"
          >
            <span class="material-icons">assignment_turned_in</span>
            <span :class="styles.tabText">Check-ins</span>
          </button>
          <button 
            :class="[styles.filterTab, activeFilter === 'florence_conversation' && styles.activeTab]"
            @click="setFilter('florence_conversation')"
          >
            <span class="material-icons">smart_toy</span>
            <span :class="styles.tabText">Florence</span>
          </button>
          <button 
            :class="[styles.filterTab, activeFilter === 'weekly' && styles.activeTab]"
            @click="goToWeeklyView()"
          >
            <span class="material-icons">trending_up</span>
            <span :class="styles.tabText">Weekly</span>
          </button>
          <button 
            :class="[styles.filterTab, activeFilter === 'monthly' && styles.activeTab]"
            @click="goToMonthlyView()"
          >
            <span class="material-icons">calendar_month</span>
            <span :class="styles.tabText">Monthly</span>
          </button>
        </div>
      </div>

      <!-- Assessment List -->
      <div :class="styles.contentArea">
        <!-- Loading State -->
        <div v-if="loading" :class="styles.loadingState">
          <div :class="styles.spinner"></div>
          <p>Loading assessments...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredAssessments.length === 0" :class="styles.emptyState">
          <div :class="styles.emptyIcon">
            <span class="material-icons">assignment</span>
          </div>
          <h2 :class="styles.emptyTitle">No assessments found</h2>
          <p :class="styles.emptyDescription">
            Complete your first health check-in or chat with Florence to get started!
          </p>
          <div :class="styles.actionButtons">
            <button :class="styles.primaryButton" @click="goToCheckin">
              <span class="material-icons">assignment_turned_in</span>
              Daily Check-in
            </button>
            <button :class="styles.secondaryButton" @click="goToFlorence">
              <span class="material-icons">smart_toy</span>
              Chat with Florence
            </button>
          </div>
        </div>

        <!-- Assessment Cards -->
        <div v-else :class="styles.assessmentGrid">
          <div 
            v-for="assessment in filteredAssessments" 
            :key="assessment.id"
            :class="styles.assessmentCard"
            @click="viewAssessment(assessment)"
          >
            <div :class="styles.cardHeader">
              <div :class="styles.cardIcon" :style="{ backgroundColor: getIconColor(assessment) }">
                <span class="material-icons">
                  {{ assessment.type === 'daily_checkin' ? 'assignment_turned_in' : 'smart_toy' }}
                </span>
              </div>
              <div :class="styles.cardInfo">
                <h3 :class="styles.cardTitle">{{ assessment.title }}</h3>
                <p :class="styles.cardDate">{{ formatDate(assessment.date) }}</p>
              </div>
              <div :class="styles.cardBadge" :style="{ backgroundColor: getIconColor(assessment) }">
                {{ assessment.type === 'daily_checkin' ? 'Check-in' : 'AI Chat' }}
              </div>
            </div>
            <div :class="styles.cardContent">
              <p :class="styles.cardSummary">{{ assessment.summary }}</p>
              <div :class="styles.cardStats" v-if="assessment.type === 'daily_checkin'">
                <div :class="styles.statPill">
                  <span class="material-icons">check_circle</span>
                  {{ assessment.data.questions_answered }} questions
                </div>
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
const isSidebarOpen = ref(false)

const totalAssessments = computed(() => assessments.value.length)
const dailyCheckins = computed(() => assessments.value.filter(a => a.type === 'daily_checkin').length)
const florenceConversations = computed(() => assessments.value.filter(a => a.type === 'florence_conversation').length)

const filteredAssessments = computed(() => {
  if (activeFilter.value === 'all') {
    return assessments.value
  }
  return assessments.value.filter(a => a.type === activeFilter.value)
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}

const setFilter = (filter) => {
  activeFilter.value = filter
  closeSidebar()
}

const getIconColor = (assessment) => {
  // For Florence conversations, use oncologist notification level for color
  if (assessment.type === 'florence_conversation' && assessment.oncologist_notification_level) {
    switch (assessment.oncologist_notification_level) {
      case 'red':
        return 'var(--color-error-500)' // Red for urgent
      case 'amber':
        return 'var(--color-warning-500)' // Amber/orange for caution
      case 'none':
      default:
        return 'var(--color-success-500)' // Green for normal/no alerts
    }
  }
  // For daily check-ins, use lavender
  return 'var(--color-lavender-500)'
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
  closeSidebar()
}

const goToFlorence = () => {
  router.push('/florence')
  closeSidebar()
}

const goToWeeklyView = () => {
  router.push('/weekly-analytics')
  closeSidebar()
}

const goToMonthlyView = () => {
  router.push('/monthly-analytics')
  closeSidebar()
}

const viewAssessment = (assessment) => {
  // Navigate to assessment detail view
  console.log('Viewing assessment:', assessment)
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