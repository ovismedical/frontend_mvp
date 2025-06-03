import { createRouter, createWebHistory } from 'vue-router'

import MainPage from '../pages/MainPage.vue'
import PatientLogin from '../pages/PatientLogin.vue'
import CreateAccount from '../pages/CreateAccount.vue'
import DashboardPage from '../pages/Dashboard.vue'
import QuizPage from '../pages/QuizPage.vue'
import FlorenceChat from '../pages/FlorenceChat.vue'
import Assessments from '../pages/Assessments.vue'
import AssessmentDetail from '../pages/AssessmentDetail.vue'
import HelpCenter from '../pages/HelpCenter.vue'
import Settings from '../pages/Settings.vue'

const routes = [
  { path: '/', component: MainPage },
  { path: '/patientlogin', component: PatientLogin },
  { path: '/createaccount', component: CreateAccount },
  { path: '/dashboard', component: DashboardPage },
  { path: '/quiz', component: QuizPage },
  { path: '/florence', component: FlorenceChat },
  { path: '/assessments', component: Assessments },
  { path: '/assessment/:id', component: AssessmentDetail },
  { path: '/faq', component: HelpCenter },
  { path: '/settings', component: Settings },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
