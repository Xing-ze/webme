<script setup lang="ts">
import { ref, computed } from 'vue'
import { Play, CircleCheck, Bookmark, Pause, XCircle } from 'lucide-vue-next'
import type { Bangumi, BangumiStatus } from '@/types/media'
import { BANGUMI_STATUS, BANGUMI_STATUS_MAP } from '@/types/media'
import { useMediaStore } from '@/stores/media'

const store = useMediaStore()

type FilterId = BangumiStatus | 'all'
const activeFilter = ref<FilterId>('all')

const filteredBangumi = computed<Bangumi[]>(() => {
  const list = store.data?.bangumi ?? []
  if (activeFilter.value === 'all') return list
  return list.filter(b => b.status === activeFilter.value)
})

const totalCount = computed(() => store.data?.bangumi.length ?? 0)
const completedCount = computed(() => store.bangumiStatusCounts.completed)
const watchingCount = computed(() => store.bangumiStatusCounts.watching)
const ratioPercent = computed(() => Math.round(store.bangumiTotalWatchedRatio * 100))

function getStatusIcon(id: BangumiStatus) {
  switch (id) {
    case 'watching': return Play
    case 'completed': return CircleCheck
    case 'plan': return Bookmark
    case 'on_hold': return Pause
    case 'dropped': return XCircle
  }
}

function firstChar(title: string): string {
  const t = title.trim()
  return t.charAt(0) || '?'
}

function onImgError(e: Event) {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
  const holder = img.parentElement?.querySelector<HTMLElement>('[data-fallback]')
  if (holder) holder.style.display = 'flex'
}

function progressRatio(b: Bangumi): number {
  if (b.totalEpisodes <= 0) return 0
  return Math.min(1, b.watchedEpisodes / b.totalEpisodes)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Status filters -->
    <div class="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-2 -mx-1 px-1">
      <button
        class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-fullButton px-4 py-1.5 text-sm font-medium border transition-all duration-200"
        :class="activeFilter === 'all'
          ? 'bg-accent text-white border-transparent shadow-card'
          : 'bg-surface-secondary border-default text-secondary hover:text-primary hover:bg-surface-tertiary'"
        @click="activeFilter = 'all'"
      >
        全部
        <span class="ml-0.5 opacity-80">{{ totalCount }}</span>
      </button>
      <button
        v-for="s in BANGUMI_STATUS"
        :key="s.id"
        class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-fullButton px-4 py-1.5 text-sm font-medium border transition-all duration-200"
        :class="activeFilter === s.id
          ? 'text-white border-transparent shadow-card'
          : 'bg-surface-secondary border-default text-secondary hover:text-primary hover:bg-surface-tertiary'"
        :style="activeFilter === s.id ? { backgroundColor: s.color, borderColor: s.color } : {}"
        @click="activeFilter = s.id"
      >
        <component :is="getStatusIcon(s.id)" class="w-3.5 h-3.5" />
        {{ s.name }}
        <span class="ml-0.5 opacity-80">{{ store.bangumiStatusCounts[s.id] }}</span>
      </button>
    </div>

    <!-- Bangumi grid -->
    <div
      v-if="filteredBangumi.length > 0"
      class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
    >
      <div
        v-for="b in filteredBangumi"
        :key="b.id"
        class="glass-card p-3 hover:-translate-y-1 hover:shadow-cardHover transition-all duration-300"
      >
        <!-- Cover -->
        <div class="relative aspect-[3/4] w-full overflow-hidden rounded-xl2 bg-surface-tertiary">
          <!-- Fallback holder -->
          <div
            data-fallback
            class="absolute inset-0 hidden items-center justify-center text-5xl font-black text-white/80 select-none"
            :style="{
              background: `linear-gradient(135deg, ${BANGUMI_STATUS_MAP[b.status].color}bb, rgba(100,100,120,0.6))`
            }"
          >
            {{ firstChar(b.title) }}
          </div>
          <img
            :src="b.cover"
            :alt="b.title"
            loading="lazy"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            @error="onImgError"
          />

          <!-- Status badge (top-left) -->
          <div
            class="absolute top-2 left-2 inline-flex items-center gap-1 rounded-fullButton px-2 py-1 text-xs font-semibold text-white shadow-card"
            :style="{ backgroundColor: BANGUMI_STATUS_MAP[b.status].color + 'ee' }"
          >
            <component :is="getStatusIcon(b.status)" class="w-3 h-3" />
            {{ BANGUMI_STATUS_MAP[b.status].name }}
          </div>

          <!-- Score badge (top-right) -->
          <div
            v-if="b.myScore !== undefined"
            class="absolute top-2 right-2 rounded-fullButton bg-black/60 text-white px-2 py-1 text-xs font-bold shadow-card backdrop-blur-sm"
          >
            ★ {{ b.myScore }}.0
          </div>

          <!-- Progress bar overlay (bottom) -->
          <div class="absolute left-0 right-0 bottom-0 h-1.5 bg-black/30 overflow-hidden">
            <div
              class="h-full transition-all duration-500"
              :style="{
                width: `${Math.round(progressRatio(b) * 100)}%`,
                backgroundColor: b.status === 'completed'
                  ? '#22c55e'
                  : BANGUMI_STATUS_MAP[b.status].color
              }"
            />
          </div>
        </div>

        <!-- Text info -->
        <div class="mt-3 px-0.5">
          <div class="font-semibold text-primary line-clamp-1 leading-tight">
            {{ b.title }}
          </div>

          <div v-if="b.genres && b.genres.length" class="mt-1.5 flex flex-wrap gap-1">
            <span
              v-for="g in b.genres.slice(0, 2)"
              :key="g"
              class="inline-block rounded-fullButton bg-surface-tertiary text-xs px-2 py-0.5 text-secondary"
            >
              {{ g }}
            </span>
          </div>

          <div class="mt-2 text-xs text-tertiary">
            已看 {{ b.watchedEpisodes }} / 共 {{ b.totalEpisodes }}
          </div>

          <div v-if="b.lastWatchText" class="mt-1 text-xs text-secondary line-clamp-2 leading-relaxed italic opacity-80">
            「{{ b.lastWatchText }}」
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state for filter -->
    <div
      v-else
      class="glass-card py-16 text-center text-secondary"
    >
      当前筛选下还没有番剧～换个状态看看吧
    </div>

    <!-- Bottom summary -->
    <div class="glass-card p-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-secondary">
      <div>
        📚 总 <span class="font-semibold text-primary">{{ totalCount }}</span> 部
      </div>
      <div>
        ✅ 看完 <span class="font-semibold text-primary" style="color:#22c55e;">{{ completedCount }}</span> 部
      </div>
      <div>
        🎬 在看 <span class="font-semibold text-primary" style="color:#fb7299;">{{ watchingCount }}</span> 部
      </div>
      <div>
        📊 平均看完率 <span class="font-semibold text-accent">{{ ratioPercent }}%</span>
      </div>
    </div>
  </div>
</template>
