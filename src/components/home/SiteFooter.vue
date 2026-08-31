<script setup lang="ts">
import profile from '@/data/profile'

const currentYear = new Date().getFullYear()
const yearRange =
  profile.sinceYear === currentYear
    ? `${currentYear}`
    : `${profile.sinceYear}-${currentYear}`
</script>

<template>
  <footer class="mx-auto w-full max-w-6xl px-6 py-10 text-center text-sm">
    <div class="flex flex-col items-center gap-2">
      <p class="text-primary">
        🌱 WebMe · Made with ❤️ by Xing-ze
      </p>
      <p class="text-tertiary">
        © {{ yearRange }} Xing-ze. All rights reserved.
      </p>
      <p class="text-xs text-tertiary mt-1">
        Built with Vue 3 + TailwindCSS · Deployed on Vercel · 按
        <kbd
          class="ml-1 mr-1 rounded-md border border-default bg-surface-tertiary px-1.5 py-0.5 text-xs text-primary"
          >T</kbd
        >切换主题
      </p>
    </div>
  </footer>
</template>
