<template>
  <select 
    :value="$i18n.locale" 
    @change="changeLanguage" 
    :class="styles.langSelect"
  >
    <option value="en">English</option>
    <option value="zh-HK">繁體中文</option>
  </select>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const changeLanguage = (event) => {
  const newLocale = event.target.value
  locale.value = newLocale
  localStorage.setItem('language', newLocale)
}
</script>

<style module>
.langSelect {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background-color: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: border-color 0.15s ease-in-out;
}

.langSelect:hover {
  border-color: #3b82f6;
}

.langSelect:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style> 