<script setup lang="ts">
import { Layers, Search, Star, FileX } from 'lucide-vue-next'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { Plus } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  msg: string
  desc?: string
  icon?: 'Layers' | 'Search' | 'Star' | 'FileX'
}>(), {
  icon: 'Layers',
})

const emit = defineEmits<{
  create: []
}>()

const iconMap = { Layers, Search, Star, FileX }
</script>

<template>
  <BaseCard class="w-full">
    <div class="flex flex-col items-center justify-center py-10 text-center">
      <!-- icon -->
      <div
        class="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style="background: rgb(var(--color-accent) / 0.1);"
      >
        <component
          :is="iconMap[props.icon]"
          :size="30"
          class="text-accent"
          stroke-width="1.75"
        />
      </div>

      <h3 class="text-xl font-bold text-primary mb-2">
        {{ msg }}
      </h3>
      <p
        v-if="desc"
        class="text-sm text-secondary max-w-md leading-relaxed mb-6"
      >
        {{ desc }}
      </p>

      <BaseButton variant="primary" @click="emit('create')">
        <Plus :size="17" />
        <span>新建第一篇笔记</span>
      </BaseButton>
    </div>
  </BaseCard>
</template>
