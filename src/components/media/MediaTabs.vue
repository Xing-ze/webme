<script setup lang="ts">
import { ref } from 'vue'
import { Tv, Music, Download, Upload, RotateCcw } from 'lucide-vue-next'
import BaseButton from '@/components/common/BaseButton.vue'
import { useMediaStore } from '@/stores/media'

interface Props {
  active: 'bangumi' | 'netease'
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:active': [value: 'bangumi' | 'netease']
}>()

const store = useMediaStore()
const fileInput = ref<HTMLInputElement | null>(null)

function triggerImport() {
  fileInput.value?.click()
}

async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const f = input.files?.[0]
  if (!f) return
  await store.importJsonFromFile(f)
  input.value = ''
}

function confirmReset() {
  if (window.confirm('确定要重置媒体数据吗？将清除你导入的自定义 JSON，回退到内置示例数据。')) {
    store.reset()
  }
}
</script>

<template>
  <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <!-- Tabs -->
    <div class="relative rounded-fullButton glass-card p-1 flex w-full sm:w-[420px]">
      <!-- Sliding bar -->
      <div
        class="absolute top-1 bottom-1 w-[calc(50%-0.25rem)] rounded-fullButton transition-all duration-200 ease-out shadow-card"
        :class="props.active === 'bangumi' ? 'left-1' : 'left-[calc(50%+0.125rem)]'"
        :style="{
          backgroundColor: props.active === 'bangumi' ? '#fb7299' : '#d81e06'
        }"
        aria-hidden="true"
      />
      <button
        class="relative z-10 flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-fullButton transition-colors duration-200"
        :class="props.active === 'bangumi' ? 'text-white' : 'text-secondary hover:text-primary hover:bg-surface-tertiary/60'"
        @click="emit('update:active', 'bangumi')"
      >
        <Tv class="w-4 h-4" style="color: inherit" />
        <span>B 站追番</span>
      </button>
      <button
        class="relative z-10 flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-fullButton transition-colors duration-200"
        :class="props.active === 'netease' ? 'text-white' : 'text-secondary hover:text-primary hover:bg-surface-tertiary/60'"
        @click="emit('update:active', 'netease')"
      >
        <Music class="w-4 h-4" style="color: inherit" />
        <span>网易云年度</span>
      </button>
    </div>

    <!-- Action buttons -->
    <div class="flex items-center gap-2">
      <BaseButton variant="ghost" size="sm" @click="store.downloadTemplate()">
        <Download class="w-4 h-4" />
        <span class="hidden sm:inline">下载模板</span>
        <span class="sm:hidden">模板</span>
      </BaseButton>
      <BaseButton variant="ghost" size="sm" @click="triggerImport">
        <Upload class="w-4 h-4" />
        <span class="hidden sm:inline">导入 JSON</span>
        <span class="sm:hidden">导入</span>
      </BaseButton>
      <BaseButton variant="ghost" size="sm" @click="confirmReset">
        <RotateCcw class="w-4 h-4" />
        <span class="hidden sm:inline">重置数据</span>
        <span class="sm:hidden">重置</span>
      </BaseButton>
      <input
        ref="fileInput"
        type="file"
        accept="application/json"
        class="hidden"
        @change="onFileChange"
      />
    </div>
  </div>

  <!-- Import error banner -->
  <Transition name="fade-slide">
    <div
      v-if="store.importError"
      class="mb-4 rounded-glass px-4 py-3 text-sm border"
      style="background: rgba(239,68,68,0.08); border-color: rgba(239,68,68,0.25); color: #dc2626;"
    >
      ❌ {{ store.importError }}
    </div>
  </Transition>
</template>
