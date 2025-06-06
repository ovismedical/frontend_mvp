<template>
  <aside :class="[styles.sidebar, isOpen && styles.open]">
    <!-- Mobile Header -->
    <div :class="styles.mobileHeader">
      <button :class="styles.closeBtn" @click="closeSidebar">
        <span class="material-icons">close</span>
      </button>
      <h3 :class="styles.mobileTitle">Menu</h3>
    </div>

    <!-- Logo Area -->
    <div :class="styles.logoArea">
      <img :src="logo" :class="styles.logo" alt="Ovis Logo" />
      <h2 :class="styles.brandName">Ovis</h2>
    </div>
    
    <!-- Navigation -->
    <nav :class="styles.nav">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        :class="[styles.navLink, $route.path === item.path ? styles.active : '']"
        @click="closeSidebar"
      >
        <span :class="['material-icons', styles.navIcon]">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>
    
    <!-- Footer with Sign Out -->
    <div :class="styles.sidebarFooter">
      <button :class="styles.signOutBtn" @click="signOut">
        <span class="material-icons">logout</span>
        <span>Sign Out</span>
      </button>
    </div>
  </aside>

  <!-- Mobile Overlay -->
  <div v-if="isOpen" :class="styles.overlay" @click="closeSidebar"></div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import logo from '../assets/logo.png'
import styles from './Sidebar.module.css'

const route = useRoute()
const router = useRouter()

// Mobile sidebar state
const isOpen = ref(false)

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/quiz', label: 'Daily Check-in', icon: 'assignment_turned_in' },
  { path: '/florence', label: 'Chat with Florence', icon: 'smart_toy' },
  { path: '/assessments', label: 'My Assessments', icon: 'assessment' },
  { path: '/faq', label: 'Help Center', icon: 'help' },
  { path: '/settings', label: 'Settings', icon: 'settings' }
]

const signOut = () => {
  localStorage.removeItem('token')
  router.push('/patientlogin')
  closeSidebar()
}

const closeSidebar = () => {
  isOpen.value = false
}

// Expose methods for parent components
defineExpose({
  open: () => { isOpen.value = true },
  close: closeSidebar,
  toggle: () => { isOpen.value = !isOpen.value }
})
</script>
