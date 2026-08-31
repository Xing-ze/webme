import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { THEMES, type ThemeId, type ThemeMeta } from '@/types/theme'

const STORAGE_KEY = 'webme-theme'
const FALLBACK_THEME: ThemeId = 'light'

function readStoredThemeId(): ThemeId {
  if (typeof localStorage === 'undefined') return FALLBACK_THEME
  const raw = localStorage.getItem(STORAGE_KEY)
  const match = THEMES.find((t) => t.id === raw)
  return match ? match.id : FALLBACK_THEME
}

export const useThemeStore = defineStore('theme', () => {
  const currentThemeId = ref<ThemeId>(readStoredThemeId())

  const currentMeta = computed<ThemeMeta>(() => {
    const found = THEMES.find((t) => t.id === currentThemeId.value)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return found!
  })

  function applyTheme(id: ThemeId) {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', id)
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, id)
    }
    currentThemeId.value = id
  }

  function cycleTheme() {
    const idx = THEMES.findIndex((t) => t.id === currentThemeId.value)
    const next = THEMES[(idx + 1) % THEMES.length]
    applyTheme(next.id)
  }

  // 初始化时立即应用一次，避免首屏闪跳
  applyTheme(currentThemeId.value)

  return {
    currentThemeId,
    currentMeta,
    applyTheme,
    cycleTheme,
  }
})
