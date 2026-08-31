<script setup lang="ts">
import { computed } from 'vue'
import {
  Layers, Briefcase, GraduationCap, Heart, FolderGit2,
  BookOpen, StickyNote, MoreHorizontal,
} from 'lucide-vue-next'
import { KNOWLEDGE_CATEGORIES, CATEGORY_META_MAP, type KnowledgeCategoryId } from '@/types/knowledge'
import { useKnowledgeStore } from '@/stores/knowledge'

const store = useKnowledgeStore()

const iconComponents: Record<string, any> = {
  Layers, Briefcase, GraduationCap, Heart, FolderGit2,
  BookOpen, StickyNote, MoreHorizontal,
}

function onSelect(id: KnowledgeCategoryId) {
  store.setActiveCategory(id)
}

defineProps<{
  layout?: 'sidebar' | 'chips'
}>()

const active = computed(() => store.activeCategory)
const counts = computed(() => store.categoryCounts)
</script>

<template>
  <!-- 侧边栏 (md+) -->
  <nav
    v-if="layout === 'sidebar'"
    class="flex flex-col gap-1.5"
  >
    <button
      v-for="cat in KNOWLEDGE_CATEGORIES"
      :key="cat.id"
      type="button"
      class="group flex items-center gap-3 w-full rounded-xl2 px-3 py-2.5 text-left transition-all duration-200"
      :class="[
        active === cat.id
          ? 'bg-accent text-white shadow-card'
          : 'text-primary hover:bg-surface-tertiary'
      ]"
      @click="onSelect(cat.id)"
    >
      <component
        :is="iconComponents[cat.icon]"
        :size="18"
        :style="active === cat.id ? { color: 'white' } : { color: cat.color }"
        class="shrink-0 transition-transform group-hover:scale-110"
      />
      <span class="flex-1 text-sm font-medium truncate">{{ cat.name }}</span>
      <span
        class="text-xs shrink-0 px-2 py-0.5 rounded-fullButton transition-all"
        :class="[
          active === cat.id
            ? 'bg-white/25 text-white'
            : 'bg-surface-tertiary text-tertiary'
        ]"
      >
        {{ counts[cat.id] ?? 0 }}
      </span>
    </button>
  </nav>

  <!-- 移动端横滑胶囊 -->
  <nav
    v-else
    class="flex flex-row gap-2 overflow-x-auto pb-1 scrollbar-thin -mx-4 px-4"
  >
    <button
      v-for="cat in KNOWLEDGE_CATEGORIES"
      :key="cat.id"
      type="button"
      class="shrink-0 inline-flex items-center gap-1.5 rounded-fullButton px-3.5 py-1.5 text-sm font-medium transition-all duration-200 whitespace-nowrap"
      :class="[
        active === cat.id
          ? 'bg-accent text-white shadow-card'
          : 'bg-surface-secondary border border-default text-primary hover:bg-surface-tertiary'
      ]"
      @click="onSelect(cat.id)"
    >
      <component
        :is="iconComponents[cat.icon]"
        :size="15"
        :style="active === cat.id ? { color: 'white' } : { color: cat.color }"
      />
      <span>{{ cat.name }}</span>
      <span
        :class="active === cat.id ? 'text-white/80' : 'text-tertiary'"
      >({{ counts[cat.id] ?? 0 }})</span>
    </button>
  </nav>
</template>

<script lang="ts">
// 避免 ts 报 unused 导入
void ({} as typeof CATEGORY_META_MAP)
</script>
