<template>
  <div :class="styles.pageWrapper">
    <aside :class="styles.sidebar">
      <SideHeader />
    </aside>

    <div :class="styles.fullPage">
      <header :class="styles.pageHeader">
        <img :src="logo" :class="styles.logo" alt="logo" />
      </header>

      <div :class="styles.quizContainer">
        <p v-if="questions.length === 0">Loading questions...</p>
        <template v-else>
          <div :class="styles.questionNumber">
            QUESTION {{ currentQuestion + 1 }}/{{ questions.length }}
          </div>

          <div :class="styles.progressBarWrapper">
            <div :class="styles.progressBar">
              <div
                :class="styles.progressFill"
                :style="{ width: progress + '%' }"
              ></div>
            </div>
            <div :class="styles.progressLabel">{{ progress.toFixed(0) }}%</div>
          </div>

          <div :class="styles.questionBox">
            {{ questions[currentQuestion].question }}
          </div>

          <div :class="styles.choicesRow">
            <button
              v-for="(choice, index) in questions[currentQuestion].choices"
              :key="index"
              @click="handleChoiceClick(choice)"
              :class="[styles.choiceButton, isSelected(choice) && styles.selected]"
            >
              {{ choice }}
            </button>
          </div>

          <input
            v-if="shouldShowOtherInput()"
            type="text"
            :class="styles.otherInput"
            placeholder="Enter your answer"
            v-model="otherInputs[currentQuestion]"
            @input="handleOtherInputChange"
          />

          <div :class="styles.navigationButtons">
            <button
              @click="handlePreviousClick"
              :disabled="currentQuestion === 0"
              :class="styles.navButton"
            >
              PREVIOUS
            </button>
            <button
              v-if="currentQuestion === questions.length - 1"
              @click="handleSubmit"
              :class="styles.submitButton"
            >
              SUBMIT
            </button>
            <button
              v-else
              @click="handleNextClick"
              :class="styles.nextButton"
            >
              NEXT
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import logo from '../assets/logo.png'
import styles from './quiz.module.css'
import SideHeader from './Sidebar.vue'

const apiUrl = import.meta.env.VITE_API_URL

const router = useRouter()

const questions = ref([])
const currentQuestion = ref(0)
const progress = ref(0)
const answers = ref([])
const otherInputs = ref({})

onMounted(async () => {
  try {
    const response = await fetch('http://0.0.0.0:8000/getquestions')
    const temp = await response.json()
    const data = temp.questions
    questions.value = data
    answers.value = Array(data.length).fill([])
    progress.value = (1 / data.length) * 100
  } catch (error) {
    console.error('Error fetching questions:', error)
  }
})

const handleChoiceClick = (choice) => {
  const updated = [...answers.value]
  const current = updated[currentQuestion.value] || []

  if (current.includes(choice)) {
    updated[currentQuestion.value] = current.filter(c => c !== choice)
  } else {
    updated[currentQuestion.value] = [...current, choice]
  }

  answers.value = updated
}

const handleOtherInputChange = () => {
  const inputValue = otherInputs.value[currentQuestion.value]
  const updatedAnswers = [...answers.value]
  const updatedOtherInputs = { ...otherInputs.value }

  updatedOtherInputs[currentQuestion.value] = inputValue
  const filtered = (updatedAnswers[currentQuestion.value] || []).filter(
    a => !a.startsWith('Other:')
  )
  updatedAnswers[currentQuestion.value] = [...filtered, `Other: ${inputValue}`]

  answers.value = updatedAnswers
  otherInputs.value = updatedOtherInputs
}

const isSelected = (choice) => {
  return (answers.value[currentQuestion.value] || []).includes(choice)
}

const shouldShowOtherInput = () => {
  return (answers.value[currentQuestion.value] || []).some(a =>
    a.toLowerCase().includes('other')
  )
}

const handleNextClick = () => {
  if (currentQuestion.value < questions.value.length - 1) {
    currentQuestion.value++
    progress.value = ((currentQuestion.value + 1) / questions.value.length) * 100
  }
}

const handlePreviousClick = () => {
  if (currentQuestion.value > 0) {
    currentQuestion.value--
    progress.value = ((currentQuestion.value + 1) / questions.value.length) * 100
  }
}

const handleSubmit = async () => {
  if (answers.value.some(a => !Array.isArray(a) || a.length === 0)) {
    alert('Please answer all questions before submitting.')
    return
  }

  let userId = 'anonymous'
  
  try {
    // Get the username from the userinfo endpoint
    const storedToken = JSON.parse(localStorage.getItem('token')).access_token
    const userResponse = await fetch('${apiUrl}/userinfo', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${storedToken}`
      }
    })
    
    if (userResponse.ok) {
      const userData = await userResponse.json()
      userId = userData.username
    }
  } catch (error) {
    console.error('Error fetching user info:', error)
    // Continue with 'anonymous' as fallback
  }

  try {
    const response = await fetch('${apiUrl}/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, answers: answers.value }),
    })

    if (response.ok) {
      alert('Quiz submitted successfully!')
      router.push('/dashboard')
    } else {
      alert('Submission failed. Please try again.')
    }
  } catch (err) {
    console.error('Error during submission:', err)
    alert('An error occurred while submitting.')
  }
}
</script>
