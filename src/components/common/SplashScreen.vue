<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'

const emit = defineEmits<{
  done: []
}>()

const logoCardRef = ref<HTMLElement | null>(null)
const maskRef = ref<HTMLElement | null>(null)

onMounted(() => {
  document.documentElement.classList.add('webme-splash-on')

  const tl = gsap.timeline({
    onComplete: () => {
      emit('done')
    },
  })

  // 1) Logo 卡片入场
  if (logoCardRef.value) {
    tl.fromTo(
      logoCardRef.value,
      { opacity: 0, scale: 0.88, y: 12 },
      { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: 'back.out(1.4)' },
      0
    )
  }

  // 2) 进度条并行（CSS keyframes 控制，这里无需额外 GSAP 动作）

  // 3) 1.1s 处整个遮罩淡出
  if (maskRef.value) {
    tl.to(
      maskRef.value,
      { opacity: 0, duration: 0.45 },
      1.1
    )
  }
})

onBeforeUnmount(() => {
  document.documentElement.classList.remove('webme-splash-on')
})
</script>

<template>
  <div
    ref="maskRef"
    class="fixed inset-0 z-[100] bg-surface transition-colors duration-300 flex flex-col items-center justify-center gap-6"
  >
    <!-- Logo 玻璃卡片 -->
    <div
      ref="logoCardRef"
      class="glass-card px-8 py-6 rounded-glass flex items-center gap-4"
    >
      <!-- 左侧 🌱 emoji + halo 光环 -->
      <div class="relative">
        <div
          class="absolute -inset-3 rounded-full bg-accent/30 blur-md animate-halo-pulse"
        />
        <span class="relative text-5xl">🌱</span>
      </div>
      <!-- 右侧文字 -->
      <div class="flex flex-col">
        <span class="text-2xl font-bold tracking-tight text-primary">WebMe</span>
        <span class="text-xs text-secondary">加载个人数字空间…</span>
      </div>
    </div>

    <!-- 进度条：CSS keyframes 动画 -->
    <div class="w-[200px] h-1.5 rounded-full bg-surface-tertiary overflow-hidden">
      <div class="h-full w-0 bg-accent rounded-full splash-progress-bar" />
    </div>
  </div>
</template>

<style scoped>
@keyframes splash-progress-grow {
  0% { width: 0%; }
  100% { width: 100%; }
}

.splash-progress-bar {
  animation: splash-progress-grow 1.4s ease-out forwards;
}
</style>

<style>
html.webme-splash-on {
  overflow: hidden;
}
</style>
