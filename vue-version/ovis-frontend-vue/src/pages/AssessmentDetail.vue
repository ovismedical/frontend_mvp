<template>
  <div :class="styles.pageWrapper">
    <!-- Mobile Header with Menu Button -->
    <header :class="styles.mobileHeader">
      <button :class="styles.menuBtn" @click="toggleSidebar">
        <span class="icon icon-md">menu</span>
      </button>
      <h1 :class="styles.mobileTitle">Assessment Detail</h1>
      <button @click="goBack" :class="styles.backBtn">
        <span class="icon icon-md">arrow_back</span>
      </button>
    </header>

    <aside :class="styles.sidebar">
      <SideHeader ref="sidebarRef" />
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
      </div>

      <div v-else-if="loading" :class="styles.loading">
        Loading assessment details...
      </div>

      <div v-else :class="styles.error">
        Assessment not found or failed to load.
      </div>

      <!-- Symptom Detail Modal -->
      <div v-if="selectedSymptom && assessment && assessment.symptoms_data[selectedSymptom]" :class="styles.modalOverlay" @click="closeModal">
        <div :class="styles.modalContent" @click.stop>
          <div :class="styles.modalHeader">
            <h3>{{ assessment.symptoms_data[selectedSymptom].name }} Details</h3>
            <button :class="styles.closeButton" @click="closeModal">×</button>
          </div>
          
          <div :class="styles.modalBody">
            <div :class="styles.symptomDetailIcon">
              {{ assessment.symptoms_data[selectedSymptom].icon }}
            </div>
            
            <div :class="styles.ratingSection">
              <div :class="styles.ratingItem">
                <h4>Frequency Rating</h4>
                <div :class="styles.ratingDisplay">
                  <div :class="styles.ratingDots">
                    <span 
                      v-for="i in 5" 
                      :key="`modal-freq-${i}`"
                      :class="[styles.modalDot, i <= assessment.symptoms_data[selectedSymptom].frequency && styles.activeDot]"
                    ></span>
                  </div>
                  <span :class="styles.ratingValue">{{ assessment.symptoms_data[selectedSymptom].frequency }}/5</span>
                </div>
                <p :class="styles.ratingDescription">How often this symptom occurs</p>
              </div>
              
              <div :class="styles.ratingItem">
                <h4>Intensity Rating</h4>
                <div :class="styles.ratingDisplay">
                  <div :class="styles.ratingDots">
                    <span 
                      v-for="i in 5" 
                      :key="`modal-int-${i}`"
                      :class="[styles.modalDot, i <= assessment.symptoms_data[selectedSymptom].intensity && styles.activeDot]"
                    ></span>
                  </div>
                  <span :class="styles.ratingValue">{{ assessment.symptoms_data[selectedSymptom].intensity }}/5</span>
                </div>
                <p :class="styles.ratingDescription">How severe this symptom feels</p>
              </div>
            </div>
            
            <div v-if="assessment.symptoms_data[selectedSymptom].key_indicators && assessment.symptoms_data[selectedSymptom].key_indicators.length > 0" :class="styles.indicatorsSection">
              <h4>Key Indicators</h4>
              <ul :class="styles.indicatorsList">
                <li v-for="indicator in assessment.symptoms_data[selectedSymptom].key_indicators" :key="indicator">
                  "{{ indicator }}"
                </li>
              </ul>
            </div>
            
            <div v-if="assessment.symptoms_data[selectedSymptom].additional_notes" :class="styles.notesSection">
              <h4>Additional Notes</h4>
              <p :class="styles.notesText">{{ assessment.symptoms_data[selectedSymptom].additional_notes }}</p>
            </div>
          </div>
        </div>
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
const selectedSymptom = ref(null)
const sidebarRef = ref(null)

const goBack = () => {
  router.push('/assessments')
  if (sidebarRef.value) {
    sidebarRef.value.close()
  }
}

const toggleSidebar = () => {
  if (sidebarRef.value) {
    sidebarRef.value.toggle()
  }
}

const closeModal = () => {
  selectedSymptom.value = null
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

    const apiUrl = import.meta.env.VITE_API_URL || 'https://ovis-backend-mvp.onrender.com'
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