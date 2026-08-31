<script setup lang="ts">
import BaseCard from '@/components/common/BaseCard.vue'
import ThemePickerPanel from '@/components/theme/ThemePickerPanel.vue'
</script>

<template>
  <div class="flex flex-col py-6 gap-6 sm:py-10">
    <!-- 顶部介绍 -->
    <BaseCard class="px-6 py-10 sm:px-10 sm:py-12 text-center">
      <h1 class="mb-3 text-3xl font-bold tracking-tight text-primary sm:text-4xl">设置</h1>
      <p class="text-base text-secondary sm:text-lg">
        在这里配置网站的主题、个人信息、账号安全等个性化选项。
      </p>
    </BaseCard>

    <!-- 主题切换卡片（放大版） -->
    <BaseCard :hoverable="false" class="px-6 py-8 sm:px-8">
      <div class="mb-6 flex flex-col gap-1">
        <h2 class="text-xl font-semibold text-primary">外观主题</h2>
        <p class="text-sm text-secondary">选择你喜欢的视觉风格，全站即时生效。提示：在任意页面按下 <kbd class="rounded-md border border-default bg-surface-tertiary px-1.5 py-0.5 text-xs">T</kbd> 可循环切换。</p>
      </div>
      <ThemePickerPanel />
    </BaseCard>
  </div>
</template>
