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
        <h1 :class="styles.pageTitle">Weekly Analytics</h1>
        
        <!-- Week Navigation -->
        <div :class="styles.weekNavigation">
          <button 
            @click="navigateWeek(1)" 
            :class="styles.navButton"
            :disabled="currentWeekOffset >= 8"
            title="Previous Week"
          >
            ←
          </button>
          
          <div :class="styles.weekInfo">
            <div :class="styles.weekLabel">{{ weeklyData?.weekLabel || 'This Week' }}</div>
            <div :class="styles.dateRange">
              <i class="fas fa-calendar-alt"></i>
              {{ currentWeekRange }}
            </div>
          </div>
          
          <button 
            @click="navigateWeek(-1)" 
            :class="styles.navButton"
            :disabled="currentWeekOffset <= 0"
            title="Next Week"
          >
            →
          </button>
        </div>
      </header>

      <div :class="styles.analyticsContainer" v-if="weeklyData && !loading">
        <!-- Summary Cards -->
        <div :class="styles.summaryCards">
          <div :class="styles.summaryCard">
            <div :class="styles.cardIcon" style="background: #3b82f6;">
              <i class="fas fa-chart-line"></i>
            </div>
            <div :class="styles.cardContent">
              <h3>{{ weeklyData.totalAssessments }}</h3>
              <p>Total Assessments</p>
            </div>
          </div>
          
          <div :class="styles.summaryCard">
            <div :class="styles.cardIcon" style="background: #f59e0b;">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div :class="styles.cardContent">
              <h3>{{ weeklyData.totalAlerts }}</h3>
              <p>Oncologist Alerts</p>
            </div>
          </div>
          
          <div :class="styles.summaryCard">
            <div :class="styles.cardIcon" style="background: #ef4444;">
              <i class="fas fa-heartbeat"></i>
            </div>
            <div :class="styles.cardContent">
              <h3>{{ weeklyData.mostConcerningSymptom?.name || 'None' }}</h3>
              <p>Most Concerning Symptom</p>
            </div>
          </div>
          
          <div :class="styles.summaryCard">
            <div :class="styles.cardIcon" style="background: #22c55e;">
              <i class="fas fa-trending-up"></i>
            </div>
            <div :class="styles.cardContent">
              <h3>{{ weeklyData.overallTrend }}</h3>
              <p>Overall Trend</p>
            </div>
          </div>
        </div>

        <!-- Charts Row 1 -->
        <div :class="styles.chartsRow">
          <div :class="styles.chartCard">
            <h3>Symptom Severity Trends</h3>
            <div :class="styles.chartContainer">
              <Line :data="severityTrendData" :options="chartOptions.line" />
            </div>
          </div>
          
          <div :class="styles.chartCard">
            <h3>Average Severity by Symptom</h3>
            <div :class="styles.chartContainer">
              <Bar :data="symptomBarData" :options="chartOptions.bar" />
            </div>
          </div>
        </div>

        <!-- Charts Row 2 -->
        <div :class="styles.chartsRow">
          <div :class="styles.chartCard">
            <h3>Daily Assessment Heatmap</h3>
            <div :class="styles.heatmapContainer">
              <div :class="styles.heatmapGrid">
                <div 
                  v-for="(day, index) in weeklyData.dailyData" 
                  :key="index"
                  :class="styles.heatmapCell"
                  :style="{ backgroundColor: getHeatmapColor(day.avgSeverity) }"
                  :title="`${day.date}: Avg Severity ${day.avgSeverity.toFixed(1)}`"
                >
                  <div :class="styles.dayLabel">{{ formatDayLabel(day.date) }}</div>
                  <div :class="styles.severityValue">{{ day.avgSeverity.toFixed(1) }}</div>
                </div>
              </div>
              <div :class="styles.heatmapLegend">
                <span>Low</span>
                <div :class="styles.colorScale">
                  <div v-for="i in 5" :key="i" :style="{ backgroundColor: getHeatmapColor(i) }"></div>
                </div>
                <span>High</span>
              </div>
            </div>
          </div>
          
          <div :class="styles.chartCard">
            <h3>Alert Distribution</h3>
            <div :class="styles.chartContainer">
              <Doughnut :data="alertDistributionData" :options="chartOptions.doughnut" />
            </div>
          </div>
        </div>

        <!-- Detailed Insights -->
        <div :class="styles.insightsSection">
          <h3>Key Insights</h3>
          <div :class="styles.insightsList">
            <div 
              v-for="insight in weeklyData.insights" 
              :key="insight.id"
              :class="[styles.insightItem, styles[insight.type]]"
            >
              <i :class="['fas', insight.icon]"></i>
              <div :class="styles.insightContent">
                <h4>{{ insight.title }}</h4>
                <p>{{ insight.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="loading" :class="styles.loading">
        <i class="fas fa-spinner fa-spin"></i>
        Loading weekly analytics...
      </div>

      <div v-else :class="styles.error">
        <i class="fas fa-exclamation-circle"></i>
        <h3>No Data Available</h3>
        <p>Complete more Florence assessments to see weekly analytics.</p>
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
import { Line, Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import SideHeader from './Sidebar.vue'
import styles from './WeeklyAnalytics.module.css'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const router = useRouter()
const loading = ref(true)
const weeklyData = ref(null)
const currentWeekOffset = ref(0) // 0 = current week, 1 = last week, etc.

const currentWeekRange = computed(() => {
  if (weeklyData.value?.weekRange) {
    const start = new Date(weeklyData.value.weekRange.start)
    const end = new Date(weeklyData.value.weekRange.end)
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  }
  
  // Fallback calculation
  const today = new Date()
  const targetWeekStart = new Date(today)
  targetWeekStart.setDate(today.getDate() - today.getDay() - (currentWeekOffset.value * 7))
  const targetWeekEnd = new Date(targetWeekStart)
  targetWeekEnd.setDate(targetWeekStart.getDate() + 6)
  
  return `${targetWeekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${targetWeekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
})

const navigateWeek = (direction) => {
  currentWeekOffset.value += direction
  fetchWeeklyData()
}

const chartOptions = {
  line: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        title: {
          display: true,
          text: 'Severity (1-5)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    },
  },
  bar: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        title: {
          display: true,
          text: 'Average Severity'
        }
      }
    },
  },
  doughnut: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  },
}

const severityTrendData = computed(() => {
  if (!weeklyData.value?.symptomTrends) return { labels: [], datasets: [] }
  
  const symptoms = Object.keys(weeklyData.value.symptomTrends)
  const dates = weeklyData.value.dailyData.map(d => new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }))
  
  const datasets = symptoms.map((symptom, index) => ({
    label: symptom.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    data: weeklyData.value.dailyData.map(day => 
      weeklyData.value.symptomTrends[symptom]?.[day.date] || 0
    ),
    borderColor: getSymptomColor(index),
    backgroundColor: getSymptomColor(index, 0.1),
    tension: 0.4,
  }))
  
  return { labels: dates, datasets }
})

const symptomBarData = computed(() => {
  if (!weeklyData.value?.avgSeverityBySymptom) return { labels: [], datasets: [] }
  
  const symptoms = Object.keys(weeklyData.value.avgSeverityBySymptom)
  const values = Object.values(weeklyData.value.avgSeverityBySymptom)
  
  return {
    labels: symptoms.map(s => s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())),
    datasets: [{
      data: values,
      backgroundColor: symptoms.map((_, index) => getSymptomColor(index, 0.8)),
      borderColor: symptoms.map((_, index) => getSymptomColor(index)),
      borderWidth: 1,
    }]
  }
})

const alertDistributionData = computed(() => {
  if (!weeklyData.value?.alertDistribution) return { labels: [], datasets: [] }
  
  const distribution = weeklyData.value.alertDistribution
  return {
    labels: ['No Alerts', 'Amber Alerts', 'Red Alerts'],
    datasets: [{
      data: [distribution.none || 0, distribution.amber || 0, distribution.red || 0],
      backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
      borderWidth: 0,
    }]
  }
})

const getSymptomColor = (index, alpha = 1) => {
  const colors = [
    `rgba(59, 130, 246, ${alpha})`, // Blue
    `rgba(239, 68, 68, ${alpha})`,  // Red
    `rgba(34, 197, 94, ${alpha})`,  // Green
    `rgba(245, 158, 11, ${alpha})`, // Amber
    `rgba(168, 85, 247, ${alpha})`, // Purple
  ]
  return colors[index % colors.length]
}

const getHeatmapColor = (severity) => {
  const colors = [
    '#22c55e', // 1 - Green (good)
    '#84cc16', // 2 - Light green
    '#eab308', // 3 - Yellow
    '#f59e0b', // 4 - Orange
    '#ef4444', // 5 - Red (severe)
  ]
  return colors[Math.min(Math.floor(severity) - 1, 4)] || '#e5e7eb'
}

const formatDayLabel = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' })
}

const goBack = () => {
  router.push('/assessments')
}

const goToFlorence = () => {
  router.push('/florence')
}

const fetchWeeklyData = async () => {
  try {
    loading.value = true
    const token = JSON.parse(localStorage.getItem('token')).access_token
    
    const url = `http://localhost:8000/weekly_analytics?week_offset=${currentWeekOffset.value}`
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
        weeklyData.value = data.data
      } else {
        console.error('Failed to load weekly data:', data)
      }
    } else {
      console.error('API request failed:', response.status)
    }
  } catch (error) {
    console.error('Error loading weekly data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchWeeklyData()
})
</script> 