<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-surface text-primary transition-colors duration-300">
    <!-- 顶部临时导航条（阶段一 Task 2 会替换为正式布局组件） -->
    <header class="sticky top-0 z-40 glass-card mx-auto max-w-6xl mt-4 px-6 py-3 flex items-center justify-between">
      <div class="flex items-center gap-2 text-lg font-semibold tracking-tight text-primary">
        🌱 <span>WebMe</span>
      </div>
      <nav class="flex items-center gap-1 text-sm">
        <RouterLink to="/" class="px-3 py-1.5 rounded-fullButton hover:bg-surface-tertiary transition-colors">主页</RouterLink>
        <RouterLink to="/knowledge" class="px-3 py-1.5 rounded-fullButton hover:bg-surface-tertiary transition-colors">知识库</RouterLink>
        <RouterLink to="/media" class="px-3 py-1.5 rounded-fullButton hover:bg-surface-tertiary transition-colors">媒体中心</RouterLink>
        <RouterLink to="/settings" class="px-3 py-1.5 rounded-fullButton hover:bg-surface-tertiary transition-colors">设置</RouterLink>
      </nav>
    </header>
    <main class="mx-auto max-w-6xl px-4 py-8">
      <RouterView v-slot="{ Component, route }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 220ms ease, transform 220ms ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
