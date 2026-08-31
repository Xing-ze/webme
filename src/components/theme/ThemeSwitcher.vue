<script setup lang="ts">
import { Sun, Moon, Palette, Sparkles } from 'lucide-vue-next'
import { useThemeStore } from '@/composables/useTheme'
import { THEMES, type ThemeId } from '@/types/theme'

const themeStore = useThemeStore()

const iconMap: Record<ThemeId, ReturnType<typeof Sun>> = {
  light: Sun,
  dark: Moon,
  colorful: Palette,
  glass: Sparkles,
}

function handleClick(id: ThemeId) {
  themeStore.applyTheme(id)
}
</script>

<template>
  <div
    class="inline-flex items-center gap-1 rounded-fullButton glass-card px-1.5 py-1.5 transition-all duration-500"
  >
    <button
      v-for="t in THEMES"
      :key="t.id"
      :aria-label="`切换到${t.name}`"
      class="relative inline-flex h-7 w-7 items-center justify-center rounded-fullButton transition-all duration-300 ease-out"
      :class="[
        themeStore.currentThemeId === t.id
          ? 'bg-accent text-white shadow-card scale-105'
          : 'text-secondary hover:bg-surface-tertiary hover:text-primary',
      ]"
      @click="handleClick(t.id)"
    >
      <component :is="iconMap[t.id]" class="h-4 w-4" />
    </button>
  </div>
</template>
