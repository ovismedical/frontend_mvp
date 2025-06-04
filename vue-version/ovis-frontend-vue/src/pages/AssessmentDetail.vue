<template>
  <div :class="styles.pageWrapper">
    <aside :class="styles.sidebar">
      <SideHeader />
    </aside>

    <div :class="styles.fullPage">
      <header :class="styles.pageHeader">
        <button @click="goBack" :class="styles.backButton">
          ← Back
        </button>
        <h1 :class="styles.pageTitle">Health Dashboard</h1>
        <img :src="logo" :class="styles.logo" alt="logo" />
      </header>

      <div :class="styles.dashboardContainer" v-if="assessment">
        <!-- Tab Navigation -->
        <div :class="styles.tabNav">
          <button 
            :class="[styles.tab, activeTab === 'today' && styles.activeTab]"
            @click="activeTab = 'today'"
          >
            Today
          </button>
          <button 
            :class="[styles.tab, activeTab === 'week' && styles.activeTab]"
            @click="activeTab = 'week'"
          >
            This Week
          </button>
          <button 
            :class="[styles.tab, activeTab === 'month' && styles.activeTab]"
            @click="activeTab = 'month'"
          >
            This Month
          </button>
        </div>

        <!-- Assessment Summary Card -->
        <div :class="styles.summaryCard">
          <div :class="styles.assessmentHeader">
            <h2>Today's Assessment</h2>
            <span :class="styles.statusBadge">{{ assessment.treatment_status }}</span>
            <div :class="styles.completedBadge">✓ Completed</div>
          </div>

          <div :class="styles.metricsRow">
            <div :class="styles.metric">
              <div :class="styles.metricValue">{{ assessment.symptoms_tracked }}</div>
              <div :class="styles.metricLabel">Symptoms Tracked</div>
            </div>
            <div :class="styles.metric">
              <div :class="styles.metricValue">{{ Math.round(assessment.avg_severity) }}</div>
              <div :class="styles.metricLabel">Avg. Severity</div>
            </div>
            <div :class="styles.metric">
              <div :class="styles.metricValue">{{ assessment.alerts_today }}</div>
              <div :class="styles.metricLabel">Alerts Today</div>
            </div>
          </div>
        </div>

        <!-- Symptoms Section -->
        <div :class="styles.symptomsSection">
          <h3 :class="styles.sectionTitle">
            How You're Feeling Today
            <span :class="styles.subtitle">Tap any symptom for details</span>
          </h3>

          <div :class="styles.symptomsList">
            <div 
              v-for="(symptom, key) in assessment.symptoms_data" 
              :key="key"
              :class="styles.symptomCard"
              @click="selectedSymptom = key"
            >
              <div :class="styles.symptomIcon">{{ symptom.icon }}</div>
              <div :class="styles.symptomInfo">
                <h4>{{ symptom.name }}</h4>
                <div :class="styles.symptomMetrics">
                  <div :class="styles.frequencyRow">
                    <span>Frequency:</span>
                    <div :class="styles.ratingDots">
                      <span 
                        v-for="i in 5" 
                        :key="`freq-${i}`"
                        :class="[styles.dot, i <= symptom.frequency && styles.activeDot]"
                      ></span>
                      <span :class="styles.ratingText">{{ symptom.frequency }}/5</span>
                    </div>
                  </div>
                  <div :class="styles.intensityRow">
                    <span>Intensity:</span>
                    <div :class="styles.ratingDots">
                      <span 
                        v-for="i in 5" 
                        :key="`int-${i}`"
                        :class="[styles.dot, i <= symptom.intensity && styles.activeDot]"
                      ></span>
                      <span :class="styles.ratingText">{{ symptom.intensity }}/5</span>
                    </div>
                  </div>
                </div>
              </div>
              <div :class="styles.arrowIcon">→</div>
            </div>
          </div>
        </div>

        <!-- Conversation History -->
        <div :class="styles.conversationSection" v-if="assessment.conversation_history">
          <h3 :class="styles.sectionTitle">Conversation with Florence</h3>
          <div :class="styles.conversationHistory">
            <div 
              v-for="(message, index) in assessment.conversation_history.filter(m => m.role !== 'system')" 
              :key="index"
              :class="[styles.message, message.role === 'user' ? styles.userMessage : styles.assistantMessage]"
            >
              <div :class="styles.messageContent">
                {{ message.content }}
              </div>
              <div :class="styles.messageTime" v-if="message.timestamp">
                {{ formatTime(message.timestamp) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Assessment Summary -->
        <div :class="styles.summarySection" v-if="assessment.assessment_result">
          <h3 :class="styles.sectionTitle">Assessment Summary</h3>
          <div :class="styles.summaryContent">
            <p>{{ assessment.assessment_result.assessment_summary || 'Assessment completed successfully through conversation with Florence AI.' }}</p>
            
            <div v-if="assessment.assessment_result.key_concerns && assessment.assessment_result.key_concerns.length > 0">
              <h4>Key Concerns:</h4>
              <ul>
                <li v-for="concern in assessment.assessment_result.key_concerns" :key="concern">
                  {{ concern }}
                </li>
              </ul>
            </div>

            <div v-if="assessment.assessment_result.recommended_follow_up">
              <h4>Recommended Follow-up:</h4>
              <p>{{ assessment.assessment_result.recommended_follow_up }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="loading" :class="styles.loading">
        Loading assessment details...
      </div>

      <div v-else :class="styles.error">
        Assessment not found or failed to load.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import logo from '../assets/logo.png'
import styles from './assessmentDetail.module.css'
import SideHeader from './Sidebar.vue'

const apiUrl = import.meta.env.VITE_API_URL

const route = useRoute()
const router = useRouter()

const assessment = ref(null)
const loading = ref(true)
const activeTab = ref('today')
const selectedSymptom = ref(null)

const goBack = () => {
  router.push('/assessments')
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  try {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return ''
  }
}

onMounted(async () => {
  const assessmentId = route.params.id
  if (!assessmentId) {
    router.push('/assessments')
    return
  }

  try {
    const storedToken = JSON.parse(localStorage.getItem('token'))?.access_token
    if (!storedToken) {
      router.push('/patientlogin')
      return
    }

    const response = await fetch(`${apiUrl}/assessment/${assessmentId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${storedToken}`
      }
    })

    if (response.ok) {
      const data = await response.json()
      if (data.success) {
        assessment.value = data.assessment
      } else {
        console.error('Failed to load assessment:', data)
      }
    } else {
      console.error('API request failed:', response.status)
    }
  } catch (error) {
    console.error('Error loading assessment:', error)
  } finally {
    loading.value = false
  }
})
</script> 