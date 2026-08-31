<script setup lang="ts">
import { Sun, Moon, Palette, Sparkles, Check } from 'lucide-vue-next'
import { useThemeStore } from '@/composables/useTheme'
import { THEMES, type ThemeId } from '@/types/theme'

const themeStore = useThemeStore()

const iconMap: Record<ThemeId, ReturnType<typeof Sun>> = {
  light: Sun,
  dark: Moon,
  colorful: Palette,
  glass: Sparkles,
}

// 每个主题对应的颜色预览条渐变色
const gradientMap: Record<ThemeId, string> = {
  light: 'linear-gradient(135deg, #fbfbfd 0%, #ffffff 50%, #e8ecff 100%)',
  dark: 'linear-gradient(135deg, #141416 0%, #3a3a3c 50%, #1e1e21 100%)',
  colorful: 'linear-gradient(135deg, #ffedd5 0%, #fecaca 50%, #fbcfe8 100%)',
  glass: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(180,180,220,0.4) 50%, rgba(140,140,200,0.6) 100%)',
}

function handleClick(id: ThemeId) {
  themeStore.applyTheme(id)
}
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <button
      v-for="t in THEMES"
      :key="t.id"
      class="group relative flex flex-col overflow-hidden rounded-glass text-left transition-all duration-300"
      :class="[
        themeStore.currentThemeId === t.id
          ? 'glass-card ring-2 ring-accent shadow-cardHover -translate-y-0.5'
          : 'glass-card hover:shadow-cardHover hover:-translate-y-0.5',
      ]"
      @click="handleClick(t.id)"
    >
      <!-- 顶部颜色预览条 -->
      <div
        class="h-16 w-full"
        :style="{ background: gradientMap[t.id] }"
      />
      <div class="flex flex-col gap-2 p-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div
              class="flex h-8 w-8 items-center justify-center rounded-fullButton"
              :class="[
                themeStore.currentThemeId === t.id
                  ? 'bg-accent text-white'
                  : 'bg-surface-tertiary text-secondary',
              ]"
            >
              <component :is="iconMap[t.id]" class="h-4 w-4" />
            </div>
            <span class="text-base font-semibold text-primary">{{ t.name }}</span>
          </div>
          <!-- 激活徽章 -->
          <span
            v-if="themeStore.currentThemeId === t.id"
            class="inline-flex items-center gap-1 rounded-fullButton bg-accent px-2.5 py-1 text-xs font-medium text-white shadow-card transition-all duration-300"
          >
            <Check class="h-3 w-3" />
            已启用
          </span>
        </div>
        <p class="text-sm text-secondary leading-relaxed">{{ t.description }}</p>
      </div>
    </button>
  </div>
</template>
