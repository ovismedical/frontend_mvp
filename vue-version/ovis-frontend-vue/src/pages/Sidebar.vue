<template>
  <aside :class="styles.sidebar">
    <div :class="styles.logoArea">
      <img :src="logo" :class="styles.logo" alt="Ovis Logo" />
      <h2 :class="styles.brandName">Ovis</h2>
    </div>
    
    <nav :class="styles.nav">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        :class="[styles.navLink, $route.path === item.path ? styles.active : '']"
      >
        <i :class="['fas', item.icon, styles.navIcon]"></i>
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>
    
    <div :class="styles.sidebarFooter">
      <button :class="styles.signOutBtn" @click="signOut">
        <i class="fas fa-sign-out-alt"></i>
        <span>Sign Out</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import logo from '../assets/logo.png'
import styles from './Sidebar.module.css'

const route = useRoute()
const router = useRouter()

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'fa-home' },
  { path: '/quiz', label: 'Daily Check-in', icon: 'fa-clipboard-check' },
  { path: '/florence', label: 'Chat with Florence', icon: 'fa-robot' },
  { path: '/assessments', label: 'My Assessments', icon: 'fa-history' },
  { path: '/faq', label: 'Help Center', icon: 'fa-question-circle' },
  { path: '/settings', label: 'Settings', icon: 'fa-cog' }
]

const signOut = () => {
  localStorage.removeItem('token')
  router.push('/patientlogin')
}
</script>
