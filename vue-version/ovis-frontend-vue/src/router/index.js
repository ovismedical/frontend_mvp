import { createRouter, createWebHistory } from 'vue-router'

import MainPage from '../pages/MainPage.vue'
import PatientLogin from '../pages/PatientLogin.vue'
import DashboardPage from '../pages/Dashboard.vue'
import QuizPage from '../pages/QuizPage.vue'

const routes = [
  { path: '/', component: MainPage },
  { path: '/patientlogin', component: PatientLogin },
  { path: '/dashboard', component: DashboardPage },
  { path: '/quiz', component: QuizPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
