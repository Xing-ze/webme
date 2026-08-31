<script setup lang="ts">
import { computed } from 'vue'
import { Search, Plus, Star } from 'lucide-vue-next'
import BaseButton from '@/components/common/BaseButton.vue'
import { useKnowledgeStore } from '@/stores/knowledge'

const emit = defineEmits<{
  create: []
}>()

const store = useKnowledgeStore()

const keyword = computed({
  get: () => store.searchKeyword,
  set: (val: string) => store.setSearchKeyword(val),
})

const totalFiltered = computed(() => store.filteredNotes.length)
const favOnly = computed(() => store.favoritesOnly)
</script>

<template>
  <div class="w-full glass-card rounded-glass p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
    <!-- 搜索框 -->
    <div class="flex-1 min-w-0 flex items-center gap-2 bg-surface-secondary rounded-fullButton px-4 py-2 border border-default focus-within:border-accent focus-within:ring-2 ring-accent transition-all">
      <Search :size="18" class="shrink-0 text-tertiary" />
      <input
        :value="keyword"
        @input="keyword = ($event.target as HTMLInputElement).value"
        type="text"
        placeholder="搜索笔记标题、正文或标签..."
        class="flex-1 min-w-0 bg-transparent outline-none text-sm text-primary placeholder:text-tertiary"
      />
      <button
        v-if="keyword.length > 0"
        type="button"
        class="shrink-0 text-xs text-tertiary hover:text-primary px-2 py-0.5 rounded-fullButton hover:bg-surface-tertiary"
        @click="keyword = ''"
      >清空</button>
    </div>

    <!-- 右侧按钮与计数 -->
    <div class="flex items-center gap-2 shrink-0 justify-between md:justify-end">
      <div class="flex items-center gap-2">
        <!-- 只看收藏 -->
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-fullButton px-3.5 py-2 text-sm font-medium transition-all duration-200 border"
          :class="[
            favOnly
              ? 'bg-warning/15 text-warning border-warning/40 hover:bg-warning/25'
              : 'bg-surface-secondary border-default text-secondary hover:text-primary hover:bg-surface-tertiary'
          ]"
          title="只看收藏的笔记"
          @click="store.toggleFavoritesOnly()"
        >
          <Star :size="16" :fill="favOnly ? 'currentColor' : 'none'" />
          <span class="hidden sm:inline">只看收藏</span>
        </button>

        <!-- 计数 -->
        <div class="hidden sm:flex items-center text-xs text-tertiary px-2">
          共 <span class="text-primary font-semibold mx-1">{{ totalFiltered }}</span> 篇
        </div>

        <!-- 新建按钮 -->
        <BaseButton variant="primary" @click="emit('create')">
          <Plus :size="17" />
          <span>新建笔记</span>
        </BaseButton>
      </div>
    </div>
  </div>
</template>
