<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CategorySidebar from '@/components/knowledge/CategorySidebar.vue'
import NoteCard from '@/components/knowledge/NoteCard.vue'
import NoteEditDrawer from '@/components/knowledge/NoteEditDrawer.vue'
import SearchBar from '@/components/knowledge/SearchBar.vue'
import EmptyState from '@/components/knowledge/EmptyState.vue'
import { useKnowledgeStore } from '@/stores/knowledge'
import type { KnowledgeNote } from '@/types/knowledge'
import { CATEGORY_META_MAP } from '@/types/knowledge'

const store = useKnowledgeStore()

// 抽屉控制
const drawerVisible = ref(false)
const editingNote = ref<KnowledgeNote | null>(null)

function openCreate() {
  editingNote.value = null
  drawerVisible.value = true
}
function openEdit(note: KnowledgeNote) {
  editingNote.value = note
  drawerVisible.value = true
}
function onDrawerCancel() {
  // do nothing, drawer 自行关闭
}

async function onDrawerSubmit(payload: any) {
  try {
    if (editingNote.value && editingNote.value.id !== undefined) {
      await store.updateNote(editingNote.value.id, payload)
    } else {
      await store.createNote(payload)
    }
    drawerVisible.value = false
    editingNote.value = null
  } catch (e: any) {
    // 理论上 title 已在抽屉内校验，这里兜个底
    if (e?.message) {
      window.alert(e.message)
    }
  }
}

async function onCardDelete(note: KnowledgeNote) {
  const ok = window.confirm(`确定删除「${note.title}」吗？此操作不可撤销。`)
  if (!ok) return
  if (note.id === undefined) return
  await store.deleteNote(note.id)
}
function onCardEdit(note: KnowledgeNote) {
  openEdit(note)
}
async function onCardTogglePin(note: KnowledgeNote) {
  if (note.id === undefined) return
  await store.togglePin(note.id)
}
async function onCardToggleFavorite(note: KnowledgeNote) {
  if (note.id === undefined) return
  await store.toggleFavorite(note.id)
}

// 生成骨架屏数量
const skeletonCount = 9

onMounted(() => {
  store.ensureLoaded()
})

// 避免 TS 报 CATEGORY_META_MAP 未用
void CATEGORY_META_MAP
</script>

<template>
  <div class="w-full min-h-0 flex flex-col pb-20">
    <!-- 顶部工具条（全局宽度） -->
    <div class="px-4 sm:px-6 lg:px-8 pt-6 max-w-7xl mx-auto w-full">
      <SearchBar @create="openCreate" />
    </div>

    <!-- 主体：分类 + 卡片 -->
    <div class="flex gap-6 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
      <!-- 左侧分类栏 (md+) -->
      <aside class="md:w-64 shrink-0 hidden md:block">
        <div class="sticky top-4">
          <CategorySidebar layout="sidebar" />
        </div>
      </aside>

      <!-- 右侧主内容 -->
      <main class="flex-1 min-w-0">
        <!-- 移动端横滑分类（仅 <md 可见） -->
        <div class="md:hidden mb-5">
          <CategorySidebar layout="chips" />
        </div>

        <!-- 骨架屏：loading -->
        <div
          v-if="store.loading"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <div
            v-for="i in skeletonCount"
            :key="i"
            class="glass-card p-6 rounded-glass space-y-4"
          >
            <div class="flex items-center justify-between">
              <div class="h-5 w-16 rounded-fullButton bg-surface-tertiary animate-pulse" />
              <div class="flex items-center gap-1">
                <div class="w-8 h-8 rounded-fullButton bg-surface-tertiary animate-pulse" />
                <div class="w-8 h-8 rounded-fullButton bg-surface-tertiary animate-pulse" />
                <div class="w-8 h-8 rounded-fullButton bg-surface-tertiary animate-pulse" />
                <div class="w-8 h-8 rounded-fullButton bg-surface-tertiary animate-pulse" />
              </div>
            </div>
            <div class="space-y-2">
              <div class="h-6 w-3/4 rounded-lg bg-surface-tertiary animate-pulse" />
              <div class="h-6 w-2/3 rounded-lg bg-surface-tertiary animate-pulse" />
            </div>
            <div class="space-y-1.5">
              <div class="h-4 w-full rounded bg-surface-tertiary/80 animate-pulse" />
              <div class="h-4 w-full rounded bg-surface-tertiary/80 animate-pulse" />
              <div class="h-4 w-5/6 rounded bg-surface-tertiary/60 animate-pulse" />
            </div>
            <div class="flex gap-1.5">
              <div class="h-5 w-14 rounded-fullButton bg-surface-tertiary animate-pulse" />
              <div class="h-5 w-16 rounded-fullButton bg-surface-tertiary animate-pulse" />
            </div>
            <div class="h-px bg-border/50 my-2" />
            <div class="flex items-center justify-between">
              <div class="h-3 w-24 rounded bg-surface-tertiary animate-pulse" />
              <div class="h-3 w-20 rounded bg-surface-tertiary animate-pulse" />
            </div>
          </div>
        </div>

        <!-- 加载完但 0 条 → 空状态 -->
        <EmptyState
          v-else-if="store.filteredNotes.length === 0"
          :msg="store.emptyStateText.msg"
          :desc="store.emptyStateText.desc"
          :icon="store.searchKeyword.trim() ? 'Search' : (store.favoritesOnly ? 'Star' : 'Layers')"
          @create="openCreate"
        />

        <!-- 卡片网格 -->
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <NoteCard
            v-for="note in store.filteredNotes"
            :key="note.id"
            :note="note"
            @edit="onCardEdit"
            @delete="onCardDelete"
            @toggle-pin="onCardTogglePin"
            @toggle-favorite="onCardToggleFavorite"
          />
        </div>
      </main>
    </div>

    <!-- 抽屉 -->
    <NoteEditDrawer
      v-model:visible="drawerVisible"
      :editing-note="editingNote"
      @submit="onDrawerSubmit"
      @cancel="onDrawerCancel"
    />
  </div>
</template>
