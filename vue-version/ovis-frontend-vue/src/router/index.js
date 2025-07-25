import { createRouter, createWebHistory } from 'vue-router'

import MainPage from '../pages/MainPage.vue'
import PatientLogin from '../pages/PatientLogin.vue'
import AdminLogin from '../pages/AdminLogin.vue'
import AdminDashboard from '../pages/AdminDashboard.vue'
import AdminPatientLookup from '../pages/AdminPatientLookup.vue'
import CreateAccount from '../pages/CreateAccount.vue'
import DashboardPage from '../pages/Dashboard.vue'
import QuizPage from '../pages/QuizPage.vue'
import FlorenceChat from '../pages/FlorenceChat.vue'
import Assessments from '../pages/Assessments.vue'
import AssessmentDetail from '../pages/AssessmentDetail.vue'
import WeeklyAnalytics from '../pages/WeeklyAnalytics.vue'
import MonthlyAnalytics from '../pages/MonthlyAnalytics.vue'
import HelpCenter from '../pages/HelpCenter.vue'
import Settings from '../pages/Settings.vue'

const routes = [
  { path: '/', component: MainPage },
  { path: '/patientlogin', component: PatientLogin },
  { path: '/adminlogin', component: AdminLogin },
  { path: '/createaccount', component: CreateAccount },
  { path: '/dashboard', component: DashboardPage , meta: { requiresAuth: true }},
  { path: '/admindashboard', component: AdminDashboard },
  {path: '/admin/patient/:username', component: AdminPatientLookup, props: true},
  { path: '/quiz', component: QuizPage , meta: { requiresAuth: true }},
  { path: '/florence', component: FlorenceChat , meta: { requiresAuth: true }},
  { path: '/assessments', component: Assessments , meta: { requiresAuth: true }},
  { path: '/assessment/:id', component: AssessmentDetail , meta: { requiresAuth: true }},
  { path: '/weekly-analytics', component: WeeklyAnalytics , meta: { requiresAuth: true }},
  { path: '/monthly-analytics', component: MonthlyAnalytics , meta: { requiresAuth: true }},
  { path: '/faq', component: HelpCenter , meta: { requiresAuth: true }},
  { path: '/settings', component: Settings , meta: { requiresAuth: true }},
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const isValid = await validateToken();
    if (isValid) {
      next();
    } else {
      next('/login');
    }
  } else {
    next();
  }
});

export default router
