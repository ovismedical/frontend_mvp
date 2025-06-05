<template>
  <div :class="styles.dashboard">
    <h1 :class="styles.title">Admin Dashboard</h1>
    <h2 :class="styles.subtitle">Patients by Doctor</h2>
    <div
      v-for="patient in patients"
      :key="patient.username"
      :class="styles.patientBlock"
    >
      <button
        :class="styles.patientLink"
        @click="goToPatient(patient.username)"
      >
        {{ patient.name }} {{ patient.username }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import styles from './adminDashboard.module.css'

const apiUrl = import.meta.env.VITE_API_URL

const patients = ref([])
const router = useRouter()

const fetchPatients = async () => {
  const token = JSON.parse(localStorage.getItem('token'))
  const doctor = token?.name || 'Unknown'

  try {
    const storedToken = JSON.parse(localStorage.getItem('token')).access_token
    const res = await fetch(`${apiUrl}/admin/patients`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${storedToken}`
      }
    })
    const data = await res.json()
    patients.value = data.patients
  } catch (err) {
    console.error('Failed to fetch patients:', err)
  }
}

const goToPatient = (username) => {
  router.push(`/admin/patient/${username}`)
}

onMounted(() => {
  fetchPatients()
})
</script>
