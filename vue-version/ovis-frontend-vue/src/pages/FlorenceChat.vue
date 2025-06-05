<template>
  <div :class="styles.pageWrapper">
    <aside :class="styles.sidebar">
      <SideHeader />
    </aside>

    <div :class="styles.chatContainer">
      <header :class="styles.chatHeader">
        <div :class="styles.nurseInfo">
          <div :class="styles.nurseAvatar">🤖</div>
          <div>
            <h2>Florence - AI Nurse</h2>
            <p :class="styles.status">{{ sessionStatus }}</p>
          </div>
        </div>
        <div :class="styles.headerActions">
          <button 
            v-if="sessionId" 
            @click="finishSession" 
            :class="styles.finishButton"
            :disabled="isProcessing"
          >
            Finish Assessment
          </button>
        </div>
      </header>

      <div :class="styles.chatMessages" ref="messagesContainer">
        <div v-if="!sessionId" :class="styles.welcomeMessage">
          <h3>Welcome to your check-in with Florence!</h3>
          <p>Florence is your AI nurse who will have a friendly conversation with you about how you're feeling today.</p>
          <div :class="styles.startOptions">
            <label>
              Language:
              <select v-model="language" :class="styles.select">
                <option value="en">English</option>
                <option value="zh">Cantonese</option>
              </select>
            </label>
            <label>
              Input method:
              <select v-model="inputMode" :class="styles.select">
                <option value="keyboard">Keyboard</option>
                <option value="speech">Speech</option>
              </select>
            </label>
            <button @click="startSession" :class="styles.startButton" :disabled="isProcessing">
              Start Chat with Florence
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
            <div :class="styles.typing">Florence is typing...</div>
          </div>
        </div>
      </div>

      <div v-if="sessionId" :class="styles.chatInput">
        <div :class="styles.inputContainer">
          <input
            v-model="userMessage"
            type="text"
            placeholder="Type your message to Florence..."
            :class="styles.messageInput"
            @keyup.enter="sendMessage"
            :disabled="isProcessing"
          />
          <button 
            @click="sendMessage" 
            :class="styles.sendButton"
            :disabled="!userMessage.trim() || isProcessing"
          >
            Send
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

// Reactive state
const sessionId = ref(null)
const sessionStatus = ref('Ready to start')
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

// Start a new Florence session
const startSession = async () => {
  isProcessing.value = true
  sessionStatus.value = 'Starting session...'
  
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
    
    // Add welcome message from Florence
    conversation.value.push({
      role: 'assistant',
      content: `Hello! I'm Florence, your AI nurse. ${data.message} How are you feeling today?`,
      timestamp: new Date().toISOString()
    })
    
    scrollToBottom()
  } catch (error) {
    console.error('Error starting session:', error)
    sessionStatus.value = 'Error starting session'
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
  }
}

// Finish the assessment session
const finishSession = async () => {
  if (!sessionId.value) return
  
  isProcessing.value = true
  sessionStatus.value = 'Finishing session...'
  
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
  }
}

// Load session status on mount (in case of page refresh)
onMounted(async () => {
  // For now, we'll always start fresh
  // Later we can add session recovery logic
})
</script> 