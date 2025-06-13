<template>
  <div :class="styles.pageWrapper">
    <!-- Mobile Header with Menu Button -->
    <header :class="styles.mobileHeader">
      <button :class="styles.menuBtn" @click="toggleSidebar">
        <span class="icon icon-md">menu</span>
      </button>
      <h1 :class="styles.mobileTitle">{{ $t('florence.title') }}</h1>
    </header>

    <aside :class="styles.sidebar">
      <SideHeader ref="sidebarRef" />
    </aside>

    <div :class="styles.chatContainer">
      <header :class="styles.chatHeader">
        <div :class="styles.nurseInfo">
          <div :class="styles.nurseAvatar">
            <span class="icon icon-lg">health_and_safety</span>
          </div>
          <div>
            <h2>{{ $t('florence.aiNurse') }}</h2>
            <p :class="styles.status">{{ $t(sessionStatusKey) }}</p>
          </div>
        </div>
        <div :class="styles.headerActions">
          <button 
            v-if="sessionId" 
            @click="finishSession" 
            :class="styles.finishButton"
            :disabled="isProcessing"
          >
            <span class="icon icon-sm">check_circle</span>
            {{ $t('florence.finishAssessment') }}
          </button>
        </div>
      </header>

      <div :class="styles.chatMessages" ref="messagesContainer">
        <div v-if="!sessionId" :class="styles.welcomeMessage">
          <h3>{{ $t('florence.welcomeTitle') }}</h3>
          <p>{{ $t('florence.welcomeSubtitle') }}</p>
          <div :class="styles.startOptions">
            <div :class="styles.optionGroup">
              <label>
                {{ $t('florence.language') }}:
                <select v-model="language" :class="styles.select" @change="onLanguageChange">
                  <option value="en">{{ $t('florence.english') }}</option>
                  <option value="zh">{{ $t('florence.cantonese') }}</option>
                </select>
              </label>
            </div>
            
            <div :class="styles.optionGroup">
              <label>
                {{ $t('florence.inputMethod') }}:
                <select v-model="inputMode" :class="styles.select" @change="onInputModeChange">
                  <option value="keyboard">{{ $t('florence.keyboard') }}</option>
                  <option value="speech" disabled>{{ $t('florence.speech') }}</option>
                </select>
              </label>
              <p :class="styles.developmentNote">
                <span class="icon icon-sm">info</span>
                {{ $t('florence.speechDevelopmentNote') }}
              </p>
            </div>
            
            <button @click="startSession" :class="styles.startButton" :disabled="isProcessing">
              <span class="icon icon-sm">play_arrow</span>
              {{ $t('florence.startChatButton') }}
            </button>
          </div>
        </div>

        <div 
          v-for="(message, index) in conversation" 
          :key="index"
          :class="[styles.message, message.role === 'user' ? styles.userMessage : styles.assistantMessage]"
        >
          <div :class="styles.messageContent">
            <div :class="styles.messageText">{{ message.content }}</div>
            <div :class="styles.messageTime">{{ formatTime(message.timestamp) }}</div>
          </div>
        </div>

        <div v-if="isProcessing" :class="[styles.message, styles.assistantMessage]">
          <div :class="styles.messageContent">
            <div :class="styles.typing">{{ $t('florence.florenceTyping') }}</div>
          </div>
        </div>
      </div>

      <div v-if="sessionId" :class="styles.chatInput">
        <div :class="styles.inputContainer">
          <input
            v-model="userMessage"
            type="text"
            :placeholder="$t('florence.messagePlaceholder')"
            :class="styles.messageInput"
            @keyup.enter="sendMessage"
            @focus="onInputFocus"
            @blur="onInputBlur"
            :disabled="isProcessing"
            ref="messageInputRef"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="sentences"
            inputmode="text"
          />
          <button 
            @click="sendMessage" 
            :class="styles.sendButton"
            :disabled="!userMessage.trim() || isProcessing"
          >
            <span class="icon icon-sm">send</span>
            {{ $t('florence.sendButton') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import SideHeader from './Sidebar.vue'
import styles from './florence.module.css'

const apiUrl = import.meta.env.VITE_API_URL

const router = useRouter()
const sidebarRef = ref(null)
const messageInputRef = ref(null)

// Reactive state
const sessionId = ref(null)
const sessionStatus = ref('Ready to start')
const sessionStatusKey = ref('florence.readyToStart')
const language = ref('en')
const inputMode = ref('keyboard')
const conversation = ref([])
const userMessage = ref('')
const isProcessing = ref(false)
const messagesContainer = ref(null)

// Auto-scroll to bottom when new messages arrive
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// Format timestamp for display
const formatTime = (timestamp) => {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// Prevent selection of disabled options
const onLanguageChange = () => {
  // Language can now be freely changed between English and Cantonese
}

const onInputModeChange = () => {
  if (inputMode.value === 'speech') {
    inputMode.value = 'keyboard'
  }
}

// Start a new Florence session
const startSession = async () => {
  // Ensure we're not using disabled options
  if (inputMode.value === 'speech') inputMode.value = 'keyboard'
  
  isProcessing.value = true
  sessionStatus.value = 'Starting session...'
  sessionStatusKey.value = 'florence.startingSession'
  
  try {
    const storedToken = JSON.parse(localStorage.getItem('token')).access_token
    const apiUrl = import.meta.env.VITE_API_URL || 'https://ovis-backend-mvp.onrender.com'
    const response = await fetch(`${apiUrl}/florence/start_session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${storedToken}`
      },
      body: JSON.stringify({
        language: language.value,
        input_mode: inputMode.value
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    sessionId.value = data.session_id
    sessionStatus.value = 'Connected'
    sessionStatusKey.value = 'florence.connected'
    
    // Add welcome message from Florence
    conversation.value.push({
      role: 'assistant',
      content: data.message || "Hello! I'm Florence, your AI nurse. How are you feeling today?",
      timestamp: new Date().toISOString()
    })
    
    scrollToBottom()
  } catch (error) {
    console.error('Error starting session:', error)
    sessionStatus.value = 'Error starting session'
    sessionStatusKey.value = 'florence.errorStarting'
    alert('Failed to start session with Florence. Please try again.')
  } finally {
    isProcessing.value = false
  }
}

// Send message to Florence
const sendMessage = async () => {
  if (!userMessage.value.trim() || !sessionId.value || isProcessing.value) return
  
  const message = userMessage.value.trim()
  userMessage.value = ''
  isProcessing.value = true
  
  // Add user message to conversation
  conversation.value.push({
    role: 'user',
    content: message,
    timestamp: new Date().toISOString()
  })
  
  scrollToBottom()
  
  try {
    const storedToken = JSON.parse(localStorage.getItem('token')).access_token
    const apiUrl = import.meta.env.VITE_API_URL || 'https://ovis-backend-mvp.onrender.com'
    const response = await fetch(`${apiUrl}/florence/send_message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${storedToken}`
      },
      body: JSON.stringify({
        session_id: sessionId.value,
        message: message
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    // Add Florence's response
    conversation.value.push({
      role: 'assistant',
      content: data.response,
      timestamp: new Date().toISOString()
    })
    
    scrollToBottom()
  } catch (error) {
    console.error('Error sending message:', error)
    // Add error message to conversation
    conversation.value.push({
      role: 'assistant',
      content: 'Sorry, I had trouble understanding that. Could you please try again?',
      timestamp: new Date().toISOString()
    })
    scrollToBottom()
  } finally {
    isProcessing.value = false
    // Re-focus input on mobile after sending message
    nextTick(() => {
      if (messageInputRef.value && window.innerWidth <= 767) {
        messageInputRef.value.focus()
      }
    })
  }
}

// Finish the assessment session
const finishSession = async () => {
  if (!sessionId.value) return
  
  isProcessing.value = true
  sessionStatus.value = 'Finishing session...'
  sessionStatusKey.value = 'florence.finishingSession'
  
  try {
    const storedToken = JSON.parse(localStorage.getItem('token')).access_token
    const response = await fetch(`${apiUrl}/florence/finish_session/${sessionId.value}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${storedToken}`
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    alert('Assessment completed and saved! Thank you for checking in with Florence.')
    router.push('/dashboard')
  } catch (error) {
    console.error('Error finishing session:', error)
    alert('Failed to save assessment. Please try again.')
  } finally {
    isProcessing.value = false
    sessionStatus.value = 'Connected'
    sessionStatusKey.value = 'florence.connected'
  }
}

const toggleSidebar = () => {
  if (sidebarRef.value) {
    sidebarRef.value.toggle()
  }
}

// Mobile input focus handlers
const onInputFocus = () => {
  // Ensure the input is visible when keyboard appears on mobile
  setTimeout(() => {
    if (messageInputRef.value) {
      messageInputRef.value.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, 300)
}

const onInputBlur = () => {
  // Handle any cleanup needed when input loses focus
}

// Handle mobile keyboard behavior
const handleMobileKeyboard = () => {
  if (!messageInputRef.value) return
  
  const input = messageInputRef.value
  
  // Handle input focus for mobile
  const onFocus = () => {
    setTimeout(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    }, 300) // Delay to allow keyboard to appear
  }
  
  // Handle input blur
  const onBlur = () => {
    setTimeout(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    }, 100)
  }
  
  input.addEventListener('focus', onFocus)
  input.addEventListener('blur', onBlur)
  
  // Cleanup
  return () => {
    input.removeEventListener('focus', onFocus)
    input.removeEventListener('blur', onBlur)
  }
}

// Load session status on mount (in case of page refresh)
onMounted(async () => {
  // For now, we'll always start fresh
  // Later we can add session recovery logic
  
  // Setup mobile keyboard handling
  nextTick(() => {
    if (window.innerWidth <= 767) {
      handleMobileKeyboard()
    }
  })
})

// Proposed wellness score calculation
const calculateWellnessScore = (weeklyData) => {
  if (!weeklyData || !weeklyData.dailyData) return 75; // Default

  const assessmentDays = weeklyData.dailyData.filter(day => day.hasData);
  
  if (assessmentDays.length === 0) return 75; // No data
  
  // Factors for wellness score:
  const consistencyWeight = 0.3; // 30% - How often they track
  const severityWeight = 0.5;    // 50% - Average symptom severity  
  const alertWeight = 0.2;       // 20% - Number of alerts

  // 1. Consistency Score (0-100)
  const consistencyScore = (assessmentDays.length / 7) * 100;
  
  // 2. Severity Score (0-100) - inverse of severity
  const avgSeverity = assessmentDays.reduce((sum, day) => sum + day.avgSeverity, 0) / assessmentDays.length;
  const severityScore = Math.max(0, 100 - (avgSeverity * 20)); // 5 max severity = 0 score
  
  // 3. Alert Score (0-100) - fewer alerts = higher score
  const alertScore = Math.max(0, 100 - (weeklyData.totalAlerts * 10));
  
  // Weighted average
  const wellnessScore = Math.round(
    (consistencyScore * consistencyWeight) +
    (severityScore * severityWeight) +
    (alertScore * alertWeight)
  );
  
  return Math.max(20, Math.min(100, wellnessScore)); // Clamp between 20-100
};
</script> 