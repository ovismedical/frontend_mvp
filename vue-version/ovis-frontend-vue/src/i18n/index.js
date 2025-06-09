import { createI18n } from 'vue-i18n'
import en from './en.js'
import zhHK from './zh-HK.js'

// Detect browser language or get from localStorage
const getLocale = () => {
  const saved = localStorage.getItem('language')
  if (saved) return saved
  
  const browserLang = navigator.language
  // Check for Traditional Chinese variants (Hong Kong, Taiwan, etc.)
  if (browserLang.includes('zh-HK') || browserLang.includes('zh-TW') || browserLang.includes('zh-Hant')) {
    return 'zh-HK'
  }
  // Default to English for other languages
  return 'en'
}

const i18n = createI18n({
  legacy: false, // Enable Composition API mode
  locale: getLocale(),
  fallbackLocale: 'en',
  globalInjection: true, // Enable global $t function
  messages: {
    'en': en,
    'zh-HK': zhHK
  }
})

export default i18n 