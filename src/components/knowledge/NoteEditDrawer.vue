<script setup lang="ts">
import { ref, reactive, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { X } from 'lucide-vue-next'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import type { KnowledgeNote, KnowledgeCategoryId } from '@/types/knowledge'
import { KNOWLEDGE_CATEGORIES } from '@/types/knowledge'
import { useKnowledgeStore } from '@/stores/knowledge'

const props = withDefaults(defineProps<{
  visible: boolean
  editingNote?: KnowledgeNote | null
}>(), {
  editingNote: null,
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  submit: [data: any]
  cancel: []
}>()

const store = useKnowledgeStore()

interface FormState {
  title: string
  category: Exclude<KnowledgeCategoryId, 'all'>
  tagsStr: string
  content: string
  pinned: boolean
  favorite: boolean
}

const form = reactive<FormState>({
  title: '',
  category: 'note',
  tagsStr: '',
  content: '',
  pinned: false,
  favorite: false,
})

const titleError = ref('')
const submitting = ref(false)

/** 解析 tags 字符串 → 数组（逗号/中文逗号/空格分隔） */
function parseTags(str: string): string[] {
  return str
    .split(/[,，\s]+/)
    .map(t => t.trim())
    .filter(Boolean)
}

const categoryOptions = KNOWLEDGE_CATEGORIES.filter(c => c.id !== 'all')

function resetFormForCreate() {
  form.title = ''
  const saved = store.activeCategory !== 'all' ? store.activeCategory : 'note'
  form.category = saved as Exclude<KnowledgeCategoryId, 'all'>
  form.tagsStr = ''
  form.content = ''
  form.pinned = false
  form.favorite = false
  titleError.value = ''
}

function syncFromNote(note: KnowledgeNote) {
  form.title = note.title
  form.category = note.category
  form.tagsStr = (note.tags ?? []).join(', ')
  form.content = note.content
  form.pinned = !!note.pinned
  form.favorite = !!note.favorite
  titleError.value = ''
}

watch(
  () => props.visible,
  (val) => {
    if (!val) return
    // 打开时初始化表单
    nextTick(() => {
      if (props.editingNote) {
        syncFromNote(props.editingNote)
      } else {
        resetFormForCreate()
      }
    })
  },
  { immediate: true }
)

watch(
  () => props.editingNote,
  (val) => {
    if (!props.visible) return
    if (val) syncFromNote(val)
    else resetFormForCreate()
  }
)

function close() {
  if (submitting.value) return
  emit('update:visible', false)
  emit('cancel')
}

function onBackdropClick(e: MouseEvent) {
  // 只有直接点击遮罩层才触发关闭
  if (e.target === e.currentTarget) close()
}

async function onSubmit() {
  titleError.value = ''
  const trimmed = form.title.trim()
  if (trimmed.length === 0) {
    titleError.value = '标题不能为空'
    return
  }
  submitting.value = true
  try {
    const tags = parseTags(form.tagsStr)
    const payload = {
      title: trimmed,
      category: form.category,
      tags,
      content: form.content,
      pinned: form.pinned,
      favorite: form.favorite,
    }
    emit('submit', payload)
  } finally {
    submitting.value = false
  }
}

// ESC 关闭
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.visible) {
    e.preventDefault()
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-50"
      >
        <!-- 遮罩 -->
        <div
          class="absolute inset-0 bg-black/40 backdrop-blur-sm"
          @click="onBackdropClick"
        />
        <!-- 抽屉 -->
        <Transition
          enter-active-class="transition-transform duration-300 ease-out"
          leave-active-class="transition-transform duration-200 ease-in"
          enter-from-class="translate-x-full"
          enter-to-class="translate-x-0"
          leave-from-class="translate-x-0"
          leave-to-class="translate-x-full"
        >
          <aside
            v-if="visible"
            class="fixed top-0 right-0 h-full w-full sm:w-[560px] md:w-[640px] z-50
                   glass-card rounded-l-glass shadow-cardHover
                   flex flex-col p-6 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-[calc(1.5rem+env(safe-area-inset-bottom))]
                   overflow-y-auto"
          >
            <!-- 顶栏 -->
            <header class="flex items-center justify-between px-6 py-4 border-b border-default/70 shrink-0">
              <div class="flex items-center gap-2">
                <h2 class="text-xl font-bold text-primary">
                  {{ editingNote ? '编辑笔记' : '新建笔记' }}
                </h2>
              </div>
              <button
                type="button"
                class="w-9 h-9 rounded-fullButton inline-flex items-center justify-center
                       text-tertiary hover:text-primary hover:bg-surface-tertiary transition-all"
                title="关闭 (ESC)"
                @click="close"
              >
                <X :size="18" />
              </button>
            </header>

            <!-- 表单内容 -->
            <form
              class="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin"
              @submit.prevent="onSubmit"
            >
              <!-- 标题 -->
              <BaseInput
                v-model="form.title"
                label="标题"
                placeholder="输入笔记标题（必填）"
                :error="titleError"
              />

              <!-- 分类 -->
              <div class="w-full">
                <label class="mb-1.5 block text-sm text-secondary">分类</label>
                <select
                  v-model="form.category"
                  class="w-full rounded-xl2 border bg-surface-secondary px-4 py-2.5 text-primary
                         transition-all duration-200 focus:outline-none focus:ring-2 ring-accent
                         border-default focus:border-accent"
                >
                  <option
                    v-for="cat in categoryOptions"
                    :key="cat.id"
                    :value="cat.id"
                  >
                    {{ cat.name }}
                  </option>
                </select>
              </div>

              <!-- 标签 -->
              <BaseInput
                v-model="form.tagsStr"
                label="标签（逗号分隔，如：工作,自动化,Unity）"
                placeholder="标签1,标签2,标签3"
              />

              <!-- 正文 -->
              <div class="w-full">
                <label class="mb-1.5 block text-sm text-secondary">正文</label>
                <textarea
                  v-model="form.content"
                  rows="14"
                  placeholder="在这里记录你的想法、要点、代码片段...（支持换行）"
                  class="w-full rounded-xl2 border bg-surface-secondary px-4 py-3 text-primary
                         transition-all duration-200 focus:outline-none focus:ring-2 ring-accent
                         border-default focus:border-accent
                         whitespace-pre-wrap leading-7 text-sm resize-none scrollbar-thin"
                />
              </div>

              <!-- 选项开关 -->
              <div class="flex items-center gap-6 py-1">
                <label class="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    v-model="form.pinned"
                    type="checkbox"
                    class="w-4 h-4 accent-accent"
                  />
                  <span class="text-sm text-primary">📌 置顶</span>
                </label>
                <label class="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    v-model="form.favorite"
                    type="checkbox"
                    class="w-4 h-4 accent-accent"
                  />
                  <span class="text-sm text-primary">⭐ 收藏</span>
                </label>
              </div>

              <!-- 底部按钮 -->
              <div class="flex items-center justify-end gap-3 pt-2 border-t border-default/70 -mx-6 px-6 py-4 -mb-6">
                <BaseButton variant="secondary" type="button" @click="close">
                  取消
                </BaseButton>
                <BaseButton
                  variant="primary"
                  type="submit"
                  :disabled="submitting"
                >
                  {{ submitting ? '保存中...' : (editingNote ? '保存修改' : '创建笔记') }}
                </BaseButton>
              </div>
            </form>
          </aside>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
