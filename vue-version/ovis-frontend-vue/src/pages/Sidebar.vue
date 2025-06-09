<template>
  <aside :class="[styles.sidebar, isOpen && styles.open]">
    <!-- Mobile Header -->
    <div :class="styles.mobileHeader">
      <button :class="styles.closeBtn" @click="closeSidebar">
        <span class="material-icons">close</span>
      </button>
      <h3 :class="styles.mobileTitle">{{ $t('sidebar.menu') }}</h3>
    </div>

    <!-- Logo Area -->
    <div :class="styles.logoArea">
      <img :src="logo" :class="styles.logo" alt="Ovis Logo" />
      <h2 :class="styles.brandName">{{ $t('sidebar.brandName') }}</h2>
    </div>
    
    <!-- Navigation -->
    <nav :class="styles.nav">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.disabled ? '#' : item.path"
        :class="[
          styles.navLink, 
          $route.path === item.path ? styles.active : '',
          item.disabled ? styles.disabled : '',
          item.featured ? styles.featured : ''
        ]"
        @click="item.disabled ? null : closeSidebar"
              >
        <span :class="['material-icons', styles.navIcon]">{{ item.icon }}</span>
        <span>{{ $t(item.labelKey) }}</span>
        <span v-if="item.featured" :class="styles.featuredIndicator">
          ★
        </span>
        <span v-if="item.maintenance" :class="styles.maintenanceIndicator">
          ⚠️
        </span>
      </RouterLink>
    </nav>
    
    <!-- Footer with Sign Out -->
    <div :class="styles.sidebarFooter">
      <button :class="styles.signOutBtn" @click="signOut">
        <span class="material-icons">logout</span>
        <span>{{ $t('sidebar.signOut') }}</span>
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
  { path: '/dashboard', labelKey: 'sidebar.dashboard', icon: 'dashboard' },
  { path: '/florence', labelKey: 'sidebar.florence', icon: 'smart_toy', featured: true },
  { path: '/quiz', labelKey: 'sidebar.dailyCheckin', icon: 'assignment_turned_in', disabled: true, maintenance: true },
  { path: '/assessments', labelKey: 'sidebar.assessments', icon: 'assessment' },
  { path: '/faq', labelKey: 'sidebar.helpCenter', icon: 'help' },
  { path: '/settings', labelKey: 'sidebar.settings', icon: 'settings' }
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
