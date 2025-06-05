<template>
  <div :class="styles.pageWrapper">
    <aside :class="styles.sidebar">
      <SideHeader />
    </aside>

    <div :class="styles.fullPage">
      <header :class="styles.pageHeader">
        <button @click="goBack" :class="styles.backButton">
          ← Back to Assessments
        </button>
        <h1 :class="styles.pageTitle">Monthly Analytics</h1>
        
        <!-- Month Navigation -->
        <div :class="styles.monthNavigation">
          <button 
            @click="navigateMonth(1)" 
            :class="styles.navButton"
            :disabled="currentMonthOffset >= 12"
            title="Previous Month"
          >
            ←
          </button>
          
          <div :class="styles.monthInfo">
            <div :class="styles.monthLabel">{{ monthlyData?.monthLabel || 'This Month' }}</div>
            <div :class="styles.dateRange">
              <i class="fas fa-calendar-alt"></i>
              {{ monthlyData?.totalAssessments || 0 }} assessments
            </div>
          </div>
          
          <button 
            @click="navigateMonth(-1)" 
            :class="styles.navButton"
            :disabled="currentMonthOffset <= 0"
            title="Next Month"
          >
            →
          </button>
        </div>
      </header>

      <div :class="styles.analyticsContainer" v-if="monthlyData && !loading">
        <!-- View Mode Selector -->
        <div :class="styles.viewSelector">
          <button 
            @click="currentView = 'alerts'"
            :class="[styles.viewButton, { [styles.active]: currentView === 'alerts' }]"
          >
            <i class="fas fa-thermometer-half"></i>
            Severity Heatmap
          </button>
          
          <div :class="styles.symptomDropdown" v-if="monthlyData.availableSymptoms?.length > 0">
            <select 
              v-model="selectedSymptom" 
              @change="currentView = 'symptom'"
              :class="styles.symptomSelect"
            >
              <option value="">Select Symptom Heatmap</option>
              <option 
                v-for="symptom in monthlyData.availableSymptoms" 
                :key="symptom"
                :value="symptom"
              >
                {{ formatSymptomName(symptom) }}
              </option>
            </select>
          </div>
        </div>

        <!-- Summary Cards -->
        <div :class="styles.summaryCards">
          <div :class="styles.summaryCard">
            <div :class="styles.cardIcon" style="background: #3b82f6;">
              <i class="fas fa-chart-line"></i>
            </div>
            <div :class="styles.cardContent">
              <h3>{{ monthlyData.totalAssessments }}</h3>
              <p>Total Assessments</p>
            </div>
          </div>
          
          <div :class="styles.summaryCard">
            <div :class="styles.cardIcon" style="background: #f59e0b;">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div :class="styles.cardContent">
              <h3>{{ monthlyData.totalAlerts }}</h3>
              <p>Total Alerts</p>
            </div>
          </div>
          
          <div :class="styles.summaryCard">
            <div :class="styles.cardIcon" style="background: #22c55e;">
              <i class="fas fa-heartbeat"></i>
            </div>
            <div :class="styles.cardContent">
              <h3>{{ monthlyData.availableSymptoms?.length || 0 }}</h3>
              <p>Symptoms Tracked</p>
            </div>
          </div>
          
          <div :class="styles.summaryCard">
            <div :class="styles.cardIcon" style="background: #8b5cf6;">
              <i class="fas fa-calendar-check"></i>
            </div>
            <div :class="styles.cardContent">
              <h3>{{ getActivePercentage() }}%</h3>
              <p>Days Active</p>
            </div>
          </div>
        </div>

        <!-- Main Heatmap Display -->
        <div :class="styles.heatmapSection">
          <div :class="styles.heatmapCard">
            <h3 v-if="currentView === 'alerts'">
              <i class="fas fa-thermometer-half"></i>
              Average Severity Heatmap
            </h3>
            <h3 v-else-if="currentView === 'symptom' && selectedSymptom">
              <i class="fas fa-heartbeat"></i>
              {{ formatSymptomName(selectedSymptom) }} Severity Heatmap
            </h3>
            <h3 v-else>
              <i class="fas fa-chart-bar"></i>
              Select a view above
            </h3>
            
            <div :class="styles.calendarContainer">
              <!-- Month Calendar Grid -->
              <div :class="styles.monthGrid">
                <!-- Day headers -->
                <div 
                  v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" 
                  :key="day"
                  :class="styles.dayHeader"
                >
                  {{ day }}
                </div>
                
                <!-- Empty cells for start of month -->
                <div 
                  v-for="n in getStartPadding()" 
                  :key="`empty-${n}`"
                  :class="styles.emptyDay"
                ></div>
                
                <!-- Actual days -->
                <div 
                  v-for="day in monthlyData.daysInMonth" 
                  :key="day"
                  :class="styles.calendarDay"
                  :style="{ backgroundColor: getDayColor(day) }"
                  :title="getDayTooltip(day)"
                >
                  <div :class="styles.dayNumber">{{ day }}</div>
                  <div :class="styles.dayValue">{{ getDayValue(day) }}</div>
                </div>
              </div>
              
              <!-- Legend -->
              <div :class="styles.heatmapLegend">
                <span>{{ getLegendLabel('low') }}</span>
                <div :class="styles.colorScale">
                  <div v-for="i in 5" :key="i" :style="{ backgroundColor: getLegendColor(i) }"></div>
                </div>
                <span>{{ getLegendLabel('high') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="loading" :class="styles.loading">
        <i class="fas fa-spinner fa-spin"></i>
        Loading monthly analytics...
      </div>

      <div v-else :class="styles.error">
        <i class="fas fa-exclamation-circle"></i>
        <h3>No Data Available</h3>
        <p>Complete more Florence assessments to see monthly analytics.</p>
        <button @click="goToFlorence" :class="styles.primaryBtn">
          <i class="fas fa-robot"></i>
          Chat with Florence
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import SideHeader from './Sidebar.vue'
import styles from './MonthlyAnalytics.module.css'

const router = useRouter()
const loading = ref(true)
const monthlyData = ref(null)
const currentMonthOffset = ref(0) // 0 = current month, 1 = last month, etc.
const currentView = ref('alerts') // 'alerts' or 'symptom'
const selectedSymptom = ref('')

const navigateMonth = (direction) => {
  currentMonthOffset.value += direction
  fetchMonthlyData()
}

const formatSymptomName = (symptom) => {
  return symptom.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const getActivePercentage = () => {
  if (!monthlyData.value) return 0
  
  // Count days with any assessments
  const activeDays = new Set()
  
  // Add days with severity data (indicating assessments were done)
  Object.keys(monthlyData.value.severityByDay || {}).forEach(day => {
    activeDays.add(parseInt(day))
  })
  
  // Add days with symptoms
  Object.values(monthlyData.value.symptomsByDay || {}).forEach(symptomData => {
    Object.keys(symptomData).forEach(day => {
      activeDays.add(parseInt(day))
    })
  })
  
  const percentage = (activeDays.size / monthlyData.value.daysInMonth) * 100
  return Math.round(percentage)
}

const getStartPadding = () => {
  if (!monthlyData.value) return 0
  
  // Calculate what day of week the 1st falls on
  const firstDay = new Date(monthlyData.value.year, monthlyData.value.month - 1, 1)
  return firstDay.getDay() // 0 = Sunday, 1 = Monday, etc.
}

const getDayColor = (day) => {
  if (!monthlyData.value) return '#f3f4f6'
  
  if (currentView.value === 'alerts') {
    // Show average severity with lavender color scale
    const avgSeverity = monthlyData.value.severityByDay[day] || 0
    if (avgSeverity === 0) return '#f3f4f6' // Light gray for no assessment
    
    // Lavender scale from light to dark purple
    const lavenderColors = [
      '#e9d5ff', // Very light lavender (severity 1)
      '#d8b4fe', // Light lavender (severity 2) 
      '#c084fc', // Medium lavender (severity 3)
      '#a855f7', // Dark lavender (severity 4)
      '#9333ea'  // Deep purple (severity 5)
    ]
    const colorIndex = Math.min(Math.floor(avgSeverity) - 1, 4)
    return lavenderColors[colorIndex]
  } else if (currentView.value === 'symptom' && selectedSymptom.value) {
    const severity = monthlyData.value.symptomsByDay[selectedSymptom.value]?.[day] || 0
    if (severity === 0) return '#f3f4f6' // Gray for no data
    
    // Lavender scale for individual symptoms
    const lavenderColors = [
      '#e9d5ff', // Very light lavender (severity 1)
      '#d8b4fe', // Light lavender (severity 2)
      '#c084fc', // Medium lavender (severity 3)
      '#a855f7', // Dark lavender (severity 4)
      '#9333ea'  // Deep purple (severity 5)
    ]
    const colorIndex = Math.min(severity - 1, 4)
    return lavenderColors[colorIndex]
  }
  
  return '#f3f4f6'
}

const getDayValue = (day) => {
  if (!monthlyData.value) return ''
  
  if (currentView.value === 'alerts') {
    const avgSeverity = monthlyData.value.severityByDay[day] || 0
    return avgSeverity > 0 ? avgSeverity.toFixed(1) : ''
  } else if (currentView.value === 'symptom' && selectedSymptom.value) {
    const severity = monthlyData.value.symptomsByDay[selectedSymptom.value]?.[day] || 0
    return severity > 0 ? severity : ''
  }
  
  return ''
}

const getDayTooltip = (day) => {
  if (!monthlyData.value) return ''
  
  const date = `${monthlyData.value.monthLabel} ${day}`
  
  if (currentView.value === 'alerts') {
    const avgSeverity = monthlyData.value.severityByDay[day] || 0
    if (avgSeverity === 0) {
      return `${date}: No assessment`
    }
    return `${date}: Average severity ${avgSeverity.toFixed(1)}/5`
  } else if (currentView.value === 'symptom' && selectedSymptom.value) {
    const severity = monthlyData.value.symptomsByDay[selectedSymptom.value]?.[day] || 0
    if (severity === 0) {
      return `${date}: No ${formatSymptomName(selectedSymptom.value).toLowerCase()} data`
    }
    return `${date}: ${formatSymptomName(selectedSymptom.value)} severity ${severity}/5`
  }
  
  return date
}

const getLegendLabel = (type) => {
  if (currentView.value === 'alerts') {
    return type === 'low' ? 'No Assessment' : 'High Severity'
  } else if (currentView.value === 'symptom') {
    return type === 'low' ? 'No Data' : 'High Severity'
  }
  return ''
}

const getLegendColor = (level) => {
  // Lavender scale for both views
  const lavenderColors = [
    '#f3f4f6', // Gray for no data
    '#e9d5ff', // Very light lavender
    '#d8b4fe', // Light lavender
    '#c084fc', // Medium lavender
    '#a855f7'  // Dark lavender
  ]
  return lavenderColors[level - 1] || '#f3f4f6'
}

const goBack = () => {
  router.push('/assessments')
}

const goToFlorence = () => {
  router.push('/florence')
}

const fetchMonthlyData = async () => {
  try {
    loading.value = true
    const token = JSON.parse(localStorage.getItem('token')).access_token
    
    const url = `http://localhost:8000/monthly_analytics?month_offset=${currentMonthOffset.value}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.ok) {
      const data = await response.json()
      if (data.success) {
        monthlyData.value = data.data
        
        // Set default symptom if available
        if (monthlyData.value.availableSymptoms?.length > 0 && !selectedSymptom.value) {
          selectedSymptom.value = monthlyData.value.availableSymptoms[0]
        }
      } else {
        console.error('Failed to load monthly data:', data)
      }
    } else {
      console.error('API request failed:', response.status)
    }
  } catch (error) {
    console.error('Error loading monthly data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMonthlyData()
})
</script> 