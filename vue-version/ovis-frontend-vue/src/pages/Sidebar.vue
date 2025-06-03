<template>
  <aside :class="styles.sidebar">
    <div :class="styles.logoArea">
      <img :src="logo" :class="styles.logo" alt="Logo" />
    </div>
    <nav :class="styles.nav">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        :class="[styles.navLink, $route.path === item.path ? styles.active : '']"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import logo from '../assets/logo.png'
import styles from './Sidebar.module.css'

const route = useRoute()

const navItems = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/quiz', label: 'Daily Quiz' },
  { path: '/faq', label: 'FAQ' },
  { path: '/settings', label: 'Settings' }
]
</script>
