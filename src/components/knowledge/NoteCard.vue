<script setup lang="ts">
import { computed } from 'vue'
import { Pin, Star, Pencil, Trash2 } from 'lucide-vue-next'
import BaseCard from '@/components/common/BaseCard.vue'
import type { KnowledgeNote } from '@/types/knowledge'
import { CATEGORY_META_MAP } from '@/types/knowledge'

const props = defineProps<{
  note: KnowledgeNote
}>()

const emit = defineEmits<{
  edit: [note: KnowledgeNote]
  delete: [note: KnowledgeNote]
  togglePin: [note: KnowledgeNote]
  toggleFavorite: [note: KnowledgeNote]
}>()

const categoryMeta = computed(() => {
  return CATEGORY_META_MAP[props.note.category] ?? CATEGORY_META_MAP.other
})

/** 相对时间工具：不依赖 dayjs，只用 Intl.RelativeTimeFormat */
const rtf = new Intl.RelativeTimeFormat('zh-CN', { numeric: 'auto', style: 'short' })
function formatRelative(timestamp: number): string {
  const now = Date.now()
  const diff = timestamp - now // 负值
  const absSec = Math.round(-diff / 1000)
  if (absSec < 60) return rtf.format(-absSec, 'second')
  const absMin = Math.round(absSec / 60)
  if (absMin < 60) return rtf.format(-absMin, 'minute')
  const absHour = Math.round(absMin / 60)
  if (absHour < 24) return rtf.format(-absHour, 'hour')
  const absDay = Math.round(absHour / 24)
  if (absDay < 30) return rtf.format(-absDay, 'day')
  const absMonth = Math.round(absDay / 30)
  if (absMonth < 12) return rtf.format(-absMonth, 'month')
  return rtf.format(-Math.round(absMonth / 12), 'year')
}
function formatAbsolute(timestamp: number): string {
  const d = new Date(timestamp)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const updatedAtRel = computed(() => formatRelative(props.note.updatedAt))
const createdAtAbs = computed(() => formatAbsolute(props.note.createdAt))
</script>

<template>
  <BaseCard class="h-full flex flex-col relative overflow-hidden group">
    <!-- 置顶高亮条 -->
    <div
      v-if="note.pinned"
      class="absolute top-0 left-0 right-0 h-1"
      :style="{ background: categoryMeta.color }"
    />

    <!-- 顶部行：分类徽章 + 操作按钮 -->
    <div class="flex items-start justify-between gap-2 mb-3">
      <span
        class="inline-flex items-center gap-1 rounded-fullButton text-xs font-medium px-2.5 py-1 shrink-0 border"
        :style="{
          color: categoryMeta.color,
          background: `${categoryMeta.color}18`,
          borderColor: `${categoryMeta.color}33`,
        }"
      >
        {{ categoryMeta.name }}
      </span>
      <div class="flex items-center gap-0.5 -mr-1 shrink-0">
        <button
          type="button"
          class="w-8 h-8 rounded-fullButton inline-flex items-center justify-center transition-all duration-200 hover:bg-surface-tertiary"
          :title="note.pinned ? '取消置顶' : '置顶'"
          :class="{ 'text-accent': note.pinned, 'text-tertiary hover:text-primary': !note.pinned }"
          @click="emit('togglePin', note)"
        >
          <Pin :size="15" :fill="note.pinned ? 'currentColor' : 'none'" />
        </button>
        <button
          type="button"
          class="w-8 h-8 rounded-fullButton inline-flex items-center justify-center transition-all duration-200 hover:bg-surface-tertiary"
          :title="note.favorite ? '取消收藏' : '收藏'"
          :class="{ 'text-warning': note.favorite, 'text-tertiary hover:text-primary': !note.favorite }"
          @click="emit('toggleFavorite', note)"
        >
          <Star :size="15" :fill="note.favorite ? 'currentColor' : 'none'" />
        </button>
        <button
          type="button"
          class="w-8 h-8 rounded-fullButton inline-flex items-center justify-center transition-all duration-200 text-tertiary hover:text-accent hover:bg-surface-tertiary"
          title="编辑"
          @click="emit('edit', note)"
        >
          <Pencil :size="15" />
        </button>
        <button
          type="button"
          class="w-8 h-8 rounded-fullButton inline-flex items-center justify-center transition-all duration-200 text-tertiary hover:text-danger hover:bg-danger/10"
          title="删除"
          @click="emit('delete', note)"
        >
          <Trash2 :size="15" />
        </button>
      </div>
    </div>

    <!-- 标题 -->
    <h3
      class="text-lg font-semibold text-primary line-clamp-2 mb-2 leading-snug"
    >{{ note.title }}</h3>

    <!-- 内容预览 -->
    <p
      class="text-sm text-secondary line-clamp-3 whitespace-pre-line leading-relaxed flex-1"
    >{{ note.content }}</p>

    <!-- 标签 -->
    <div v-if="note.tags.length > 0" class="flex flex-wrap gap-1.5 mt-3">
      <span
        v-for="t in note.tags"
        :key="t"
        class="rounded-fullButton bg-surface-tertiary/70 text-xs px-2.5 py-0.5 text-secondary border border-default"
      >#{{ t }}</span>
    </div>

    <!-- 底部分隔 -->
    <div class="h-px bg-border/50 my-3 opacity-60" />

    <!-- 底部元信息 -->
    <div class="text-xs text-tertiary flex items-center justify-between">
      <span title="最后更新时间">更新于 {{ updatedAtRel }}</span>
      <span :title="'创建于 ' + createdAtAbs" class="truncate ml-2 opacity-80">
        创建·{{ createdAtAbs.slice(0, 10) }}
      </span>
    </div>
  </BaseCard>
</template>
