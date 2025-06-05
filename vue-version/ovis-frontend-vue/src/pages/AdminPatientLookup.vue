<template>
  <div :class="styles.dashboard">
    <h1 :class="styles.title">Quiz Submissions for {{ username }}</h1>

    <p v-if="answers.length === 0">No submissions found.</p>

    <ul v-else :class="styles.quizList">
      <li
        v-for="(entry, index) in answers"
        :key="index"
        :class="styles.quizItem"
      >
        <div>
          <strong>Time:</strong>
          <span :class="styles.timestamp">
            {{ formatTimestamp(entry.timestamp) }}
          </span>
        </div>
        <div><strong>Answers:</strong></div>
        <ul class="answerList">
            <li
                v-for="(answerGroup, i) in entry.answers"
                :key="i"
                class="answerItem"
            >
                {{ answerGroup[0] }}
            </li>
        </ul>

      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import styles from './adminDashboard.module.css'

const apiUrl = import.meta.env.VITE_API_URL

const route = useRoute()
const username = route.params.username
const answers = ref([])

const fetchAnswers = async () => {
  try {
    const res = await fetch(`${apiUrl}/admin/answers?user_id=${username}`)
    const data = await res.json()
    answers.value = data.answers
  } catch (err) {
    console.error('Error fetching patient answers:', err)
  }
}

const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString()
}

onMounted(() => {
  fetchAnswers()
})
</script>
