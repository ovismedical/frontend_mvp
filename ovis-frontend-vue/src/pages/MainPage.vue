<template>
  <div :class="styles.main_body">
    <div :class="styles.main_header">
      <img :src="logo" :class="styles.main_logo" />
    </div>

    <div :class="styles.main_MainPage">
      <div :class="styles.main_leftblank"></div>

      <div :class="styles.main_content">
        <RouterLink to="/patientlogin">
          <button :class="styles.main_button">{{ $t('landing.patientLogin') }}</button>
        </RouterLink>
        <RouterLink to="/adminlogin">
          <button :class="styles.main_button">{{ $t('landing.adminLogin') }}</button>
        </RouterLink>
        <RouterLink to="/faq">
          <button :class="styles.main_button">{{ $t('landing.faq') }}</button>
        </RouterLink>
      </div>

      <div :class="styles.main_rightblank"></div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import styles from './MainPage.module.css';
import logo from '../assets/logo.png';

const router = useRouter();

const handleClick = () => {
  router.push('/dashboard');
};
</script>
