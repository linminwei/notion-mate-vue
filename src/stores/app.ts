import { defineStore } from 'pinia'
import { ref } from 'vue'

const accentColors = [
  { value: '#0A84FF', lightValue: '#0066cc', name: 'blue' },
  { value: '#BF5AF2', lightValue: '#AF52DE', name: 'purple' },
  { value: '#FF453A', lightValue: '#FF3B30', name: 'red' },
  { value: '#FF9F0A', lightValue: '#FF9500', name: 'orange' },
  { value: '#32D74B', lightValue: '#28CD41', name: 'green' }
]

export const useAppStore = defineStore('app', () => {
  const isDark = ref(localStorage.getItem('apple-theme') === 'dark')
  const showRestricted = ref(localStorage.getItem('show-restricted') === 'true')
  const accentVersion = ref(0)

  const applyAccentColor = () => {
    const root = document.documentElement
    const accentName = localStorage.getItem('apple-accent-name') || 'blue'
    if (accentName === 'custom') {
      const customColor = localStorage.getItem('apple-custom-accent') || '#FF2D55'
      root.style.setProperty('--apple-blue', customColor)
    } else {
      const colorObj = accentColors.find(c => c.name === accentName) || accentColors[0]!
      root.style.setProperty('--apple-blue', isDark.value ? colorObj.value : colorObj.lightValue)
    }
    accentVersion.value++
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('apple-theme', isDark.value ? 'dark' : 'light')
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    applyAccentColor()
  }

  const toggleRestricted = () => {
    showRestricted.value = !showRestricted.value
    localStorage.setItem('show-restricted', String(showRestricted.value))
  }

  // 初始化时应用主题
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  }

  return {
    isDark,
    showRestricted,
    accentVersion,
    toggleTheme,
    toggleRestricted,
    applyAccentColor
  }
})
