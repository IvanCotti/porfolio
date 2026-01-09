import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    theme: 'dark', // 'light' | 'dark'
    language: 'es', // 'es' | 'en'
    isAnalyzerOpen: false,
    isLoading: false
  }),
  actions: {
    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark'
    },
    setLanguage(lang) {
      this.language = lang
    },
    toggleAnalyzer() {
      this.isAnalyzerOpen = !this.isAnalyzerOpen
    },
    setLoading(value) {
      this.isLoading = value
    }
  }
})
