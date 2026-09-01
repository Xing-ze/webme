<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import echarts from '@/utils/echarts'
import gsap from 'gsap'
import { Clock, Play, Music2, UserRound, Trophy, Medal } from 'lucide-vue-next'
import BaseCard from '@/components/common/BaseCard.vue'
import { useMediaStore } from '@/stores/media'
import { useThemeStore } from '@/stores/theme'

const store = useMediaStore()
const themeStore = useThemeStore()

// ---- Refs ----
const netease = computed(() => store.data?.netease)
const summary = computed(() => store.neteaseSummaryStats)

const topSongs = computed(() => (netease.value?.topSongs ?? []).slice(0, 10))
const maxPlayCount = computed(() =>
  topSongs.value.reduce((m, s) => Math.max(m, s.playCount), 1)
)

const progressBars = ref<HTMLElement[]>([])
function setProgressBar(el: HTMLElement | null, i: number) {
  if (el) progressBars.value[i] = el
}

// ---- Chart DOM refs ----
const heatmapDom = ref<HTMLDivElement | null>(null)
const pieDom = ref<HTMLDivElement | null>(null)
const barDom = ref<HTMLDivElement | null>(null)

let heatmapChart: echarts.ECharts | null = null
let pieChart: echarts.ECharts | null = null
let barChart: echarts.ECharts | null = null

function getTextColor(): string {
  const v = typeof document !== 'undefined'
    ? window.getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim()
    : ''
  return v || '#333'
}
function getTextSecondaryColor(): string {
  const v = typeof document !== 'undefined'
    ? window.getComputedStyle(document.documentElement).getPropertyValue('--color-text-secondary').trim()
    : ''
  return v || '#666'
}
function getAccentColor(): string {
  const v = typeof document !== 'undefined'
    ? window.getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim()
    : ''
  if (v && v.includes(' ')) {
    const [r, g, b] = v.split(/\s+/)
    return `rgb(${r}, ${g}, ${b})`
  }
  return v || '#667eea'
}

function initHeatmap() {
  if (!heatmapDom.value || !netease.value) return
  heatmapChart?.dispose()
  heatmapChart = echarts.init(heatmapDom.value)
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)
  // 简单估算小时 x 星期的分布：用 weekly 权重 * hourly 权重 做个近似
  const weekly = netease.value.weekly.days
  const hourly = netease.value.hourly.hours
  const data: [number, number, number][] = []
  const wsum = weekly.reduce((a, b) => a + b, 1)
  const hsum = hourly.reduce((a, b) => a + b, 1)
  const totalSum = (weekly.reduce((s, v) => s + v, 0) * 7) || 1
  for (let y = 0; y < 7; y++) {
    for (let x = 0; x < 24; x++) {
      // 估算该格子分钟 = 周一~周日这一天权重 × 该小时占比 × 一个放缩因子
      const w = weekly[y] / wsum
      const h = hourly[x] / hsum
      const val = Math.round((w * h) * totalSum * 0.35)
      data.push([x, y, val])
    }
  }
  const textColor = getTextColor()
  const secondaryColor = getTextSecondaryColor()
  heatmapChart.setOption({
    backgroundColor: 'transparent',
    textStyle: { color: textColor },
    tooltip: {
      position: 'top',
      formatter: (p: any) => {
        const d = p.data as [number, number, number]
        return `${days[d[1]]} · ${hours[d[0]]}<br/>听了 <b style="color:#d81e06;">${d[2]}</b> 分钟`
      }
    },
    grid: { left: 60, right: 24, top: 20, bottom: 40 },
    xAxis: {
      type: 'category',
      data: hours,
      splitArea: { show: true },
      axisLabel: { color: secondaryColor, fontSize: 10, interval: 2 },
      axisLine: { lineStyle: { color: secondaryColor } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'category',
      data: days,
      splitArea: { show: true },
      axisLabel: { color: secondaryColor, fontSize: 12 },
      axisLine: { lineStyle: { color: secondaryColor } },
      axisTick: { show: false },
    },
    visualMap: {
      min: 0,
      max: Math.max(...data.map(d => d[2])) || 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      textStyle: { color: secondaryColor },
      inRange: {
        color: ['#fff0f0', '#fbc4c4', '#ef6a6a', '#d81e06', '#8b0f06']
      }
    },
    series: [{
      name: '听歌分钟',
      type: 'heatmap',
      data,
      label: { show: false },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.4)'
        }
      }
    }]
  })
}

function initPie() {
  if (!pieDom.value || !netease.value) return
  pieChart?.dispose()
  pieChart = echarts.init(pieDom.value)
  const textColor = getTextColor()
  const secondaryColor = getTextSecondaryColor()
  const accent = getAccentColor()
  const genres = netease.value.genres
  const totalMinutes = netease.value.totalPlayMinutes
  pieChart.setOption({
    backgroundColor: 'transparent',
    textStyle: { color: textColor },
    tooltip: {
      trigger: 'item',
      formatter: (p: any) =>
        `${p.name}<br/>年度 <b style="color:#d81e06;">${p.value}</b> 分钟（${p.percent}%）`
    },
    legend: {
      orient: 'vertical',
      right: 16,
      top: 'center',
      textStyle: { color: secondaryColor, fontSize: 12 },
      itemGap: 10,
    },
    graphic: [
      {
        type: 'text',
        left: '26%',
        top: '42%',
        style: {
          text: '年度听歌',
          textAlign: 'center',
          fill: secondaryColor,
          fontSize: 12,
        }
      },
      {
        type: 'text',
        left: '26%',
        top: '52%',
        style: {
          text: `${totalMinutes} 分钟`,
          textAlign: 'center',
          fill: accent,
          fontSize: 16,
          fontWeight: 700,
        }
      },
    ],
    series: [
      {
        name: '流派占比',
        type: 'pie',
        radius: ['45%', '75%'],
        center: ['30%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 8,
          borderColor: 'transparent',
          borderWidth: 2,
        },
        label: { show: false },
        labelLine: { show: false },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: 'bold', color: textColor },
          itemStyle: {
            shadowBlur: 20,
            shadowColor: 'rgba(0, 0, 0, 0.25)',
          }
        },
        data: genres.map((g, i) => ({
          value: g.minutes,
          name: g.name,
          itemStyle: {
            color: [
              '#ef6a6a', '#fb923c', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#06b6d4'
            ][i % 7],
            opacity: 0.85,
          }
        })),
      }
    ]
  })
}

function initBar() {
  if (!barDom.value || !netease.value) return
  barChart?.dispose()
  barChart = echarts.init(barDom.value)
  const textColor = getTextColor()
  const secondaryColor = getTextSecondaryColor()
  const artists = netease.value.topArtists.slice(0, 7).reverse()
  barChart.setOption({
    backgroundColor: 'transparent',
    textStyle: { color: textColor },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (p: any) => {
        const d = p[0]
        return `${d.name}<br/>年度播放 <b style="color:#d81e06;">${d.value}</b> 次`
      }
    },
    grid: { left: 90, right: 30, top: 16, bottom: 24 },
    xAxis: {
      type: 'value',
      axisLabel: { color: secondaryColor, fontSize: 11 },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: secondaryColor, opacity: 0.25, type: 'dashed' } },
    },
    yAxis: {
      type: 'category',
      data: artists.map(a => a.name),
      axisLabel: { color: textColor, fontSize: 12 },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        name: '播放次数',
        type: 'bar',
        barWidth: 16,
        data: artists.map(a => a.playCount),
        itemStyle: {
          borderRadius: [0, 8, 8, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#fbc4c4' },
            { offset: 1, color: '#d81e06' },
          ])
        },
        label: {
          show: true,
          position: 'right',
          color: secondaryColor,
          fontSize: 11,
        }
      }
    ]
  })
}

function initAllCharts() {
  initHeatmap()
  initPie()
  initBar()
}

function disposeAllCharts() {
  heatmapChart?.dispose(); heatmapChart = null
  pieChart?.dispose(); pieChart = null
  barChart?.dispose(); barChart = null
}

function onResize() {
  heatmapChart?.resize()
  pieChart?.resize()
  barChart?.resize()
}

function animateProgressBars() {
  // 把所有进度条从 width 0% 动画到实际百分比
  const bars = progressBars.value.filter(Boolean)
  const songs = topSongs.value
  bars.forEach((bar, i) => {
    const song = songs[i]
    if (!bar || !song) return
    const targetPct = Math.max(4, Math.round((song.playCount / maxPlayCount.value) * 100))
    gsap.fromTo(bar,
      { width: '0%' },
      { width: `${targetPct}%`, duration: 0.8, ease: 'power3.out', delay: 0.08 * i }
    )
  })
}

function animateChartContainers() {
  // 3 个图表容器入场 stagger
  const charts: HTMLElement[] = []
  if (heatmapDom.value) charts.push(heatmapDom.value)
  if (pieDom.value) charts.push(pieDom.value)
  if (barDom.value) charts.push(barDom.value)
  if (charts.length === 0) return

  // 初始设置（如果不是由 style 写死的话）
  charts.forEach((c) => {
    c.style.opacity = '0'
    c.style.transform = 'translateY(20px)'
  })

  gsap.to(charts, {
    opacity: 1,
    y: 0,
    duration: 0.55,
    stagger: 0.12,
    ease: 'power3.out',
    delay: 0.1,
  })
}

// 当网易云数据变化 + DOM 准备好 时初始化图表
let _inited = false
onMounted(async () => {
  window.addEventListener('resize', onResize)
  // 确保 store 有数据后再初始化
  if (!netease.value) {
    // 监听一次
    const unwatch = watch(netease, async (v) => {
      if (v) {
        unwatch()
        await nextTick()
        initAllCharts()
        _inited = true
        await nextTick()
        animateProgressBars()
        animateChartContainers()
      }
    }, { immediate: true })
  } else {
    await nextTick()
    initAllCharts()
    _inited = true
    await nextTick()
    animateProgressBars()
    animateChartContainers()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  disposeAllCharts()
})

// 主题切换 -> 重绘图表
watch(() => themeStore.currentThemeId, async () => {
  if (_inited && netease.value) {
    await nextTick()
    initAllCharts()
  }
})

function rankMedal(i: number) {
  if (i === 0) return '🏆'
  if (i === 1) return '🥈'
  if (i === 2) return '🥉'
  return null
}

function rankColor(i: number): string {
  if (i === 0) return '#d97706' // 金
  if (i === 1) return '#6b7280' // 银
  if (i === 2) return '#b45309' // 铜
  return getTextSecondaryColor()
}
</script>

<template>
  <div v-if="netease" class="flex flex-col gap-6">
    <!-- 1) Top stats cards -->
    <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
      <BaseCard class="flex items-center gap-4">
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-accent">
          <Clock class="w-6 h-6" />
        </div>
        <div class="min-w-0">
          <div class="text-xs text-secondary">年度听歌时长</div>
          <div class="mt-0.5 text-xl font-bold text-primary truncate">
            {{ summary.totalHoursText }}
          </div>
          <div class="text-[11px] text-tertiary">{{ summary.totalDaysText }}</div>
        </div>
      </BaseCard>

      <BaseCard class="flex items-center gap-4">
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl" style="background: rgba(216,30,6,0.12); color: #d81e06;">
          <Play class="w-6 h-6" />
        </div>
        <div class="min-w-0">
          <div class="text-xs text-secondary">年度播放次数</div>
          <div class="mt-0.5 text-xl font-bold text-primary truncate">
            {{ summary.totalPlayCount.toLocaleString() }}
          </div>
          <div class="text-[11px] text-tertiary">按下播放键的次数</div>
        </div>
      </BaseCard>

      <BaseCard class="flex items-center gap-4">
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl" style="background: rgba(34,197,94,0.12); color: #16a34a;">
          <Music2 class="w-6 h-6" />
        </div>
        <div class="min-w-0">
          <div class="text-xs text-secondary">年度不同歌曲</div>
          <div class="mt-0.5 text-xl font-bold text-primary truncate">
            {{ summary.totalSongs.toLocaleString() }}
          </div>
          <div class="text-[11px] text-tertiary">探索了这么多旋律</div>
        </div>
      </BaseCard>

      <BaseCard class="flex items-center gap-4">
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl" style="background: rgba(99,102,241,0.12); color: #6366f1;">
          <UserRound class="w-6 h-6" />
        </div>
        <div class="min-w-0">
          <div class="text-xs text-secondary">年度接触歌手</div>
          <div class="mt-0.5 text-xl font-bold text-primary truncate">
            {{ summary.totalArtists.toLocaleString() }}
          </div>
          <div class="text-[11px] text-tertiary">{{ netease.year }} 年你遇到的声音</div>
        </div>
      </BaseCard>
    </div>

    <!-- 2) Top songs list -->
    <BaseCard>
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-bold text-primary inline-flex items-center gap-2">
          <Trophy class="w-5 h-5" style="color:#d97706;" />
          年度 Top 10 歌曲榜
        </h3>
        <span class="text-xs text-tertiary">基于 {{ netease.year }} 播放次数</span>
      </div>
      <div class="flex flex-col gap-3">
        <div
          v-for="(s, i) in topSongs"
          :key="s.id"
          class="group flex items-center gap-3"
        >
          <!-- Rank -->
          <div
            class="w-8 shrink-0 text-right font-black text-lg"
            :style="{ color: rankColor(i) }"
          >
            <span v-if="rankMedal(i)" class="mr-1">{{ rankMedal(i) }}</span>
            <span v-else>#{{ i + 1 }}</span>
          </div>

          <!-- Song info -->
          <div class="min-w-0 flex-1">
            <div class="font-semibold text-primary line-clamp-1 text-sm sm:text-base">
              {{ s.name }}
            </div>
            <div class="text-xs text-tertiary line-clamp-1">
              {{ s.artists.join(' / ') }} · {{ s.album }}
            </div>
          </div>

          <!-- Progress + count -->
          <div class="w-[40%] sm:w-[45%] shrink-0 flex items-center gap-3">
            <div class="relative flex-1 h-2.5 rounded-fullButton bg-surface-tertiary overflow-hidden">
              <div
                :ref="(el) => setProgressBar(el as HTMLElement, i)"
                class="h-full rounded-fullButton"
                :style="{
                  background: i === 0
                    ? 'linear-gradient(90deg,#f59e0b,#d97706)'
                    : i === 1
                    ? 'linear-gradient(90deg,#cbd5e1,#6b7280)'
                    : i === 2
                    ? 'linear-gradient(90deg,#fde68a,#b45309)'
                    : 'linear-gradient(90deg,#fbc4c4,#d81e06)',
                  width: '0%'
                }"
              />
            </div>
            <div class="w-14 text-right text-xs font-semibold tabular-nums text-secondary">
              {{ s.playCount }} 次
            </div>
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- 3) Charts row: heatmap + pie -->
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-5">
      <BaseCard class="lg:col-span-3">
        <h3 class="mb-3 text-lg font-bold text-primary inline-flex items-center gap-2">
          <Clock class="w-5 h-5" style="color:#d81e06;" />
          听歌时段热力图
        </h3>
        <p class="mb-2 text-xs text-tertiary">周一到周日 × 0~23 点，颜色越深代表听越久</p>
        <div ref="heatmapDom" style="width:100%;height:360px;"></div>
      </BaseCard>

      <BaseCard class="lg:col-span-2">
        <h3 class="mb-3 text-lg font-bold text-primary inline-flex items-center gap-2">
          <Music2 class="w-5 h-5" style="color:#06b6d4;" />
          年度流派占比
        </h3>
        <div ref="pieDom" style="width:100%;height:360px;"></div>
      </BaseCard>
    </div>

    <!-- 4) Top artists bar -->
    <BaseCard>
      <h3 class="mb-3 text-lg font-bold text-primary inline-flex items-center gap-2">
        <Medal class="w-5 h-5" style="color:#6366f1;" />
        年度 Top 艺人榜（播放次数）
      </h3>
      <div ref="barDom" style="width:100%;height:320px;"></div>
    </BaseCard>

    <!-- 5) Personality card -->
    <BaseCard :glass="true" class="!p-0 overflow-hidden">
      <div
        class="h-3"
        :style="{
          background: `linear-gradient(90deg, ${netease.personality.color} 0%, rgba(255,255,255,0.05) 100%)`
        }"
      />
      <div class="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:gap-8">
        <!-- Emoji -->
        <div
          class="flex h-32 w-32 shrink-0 items-center justify-center rounded-glass text-[5rem] select-none"
          style="animation: float-slow 6s ease-in-out infinite;"
        >
          {{ netease.personality.emoji }}
        </div>

        <div class="min-w-0 flex-1">
          <div
            class="inline-flex items-center rounded-fullButton px-3 py-1 text-xs font-semibold text-white"
            :style="{ backgroundColor: netease.personality.color }"
          >
            {{ netease.year }} 音乐人格
          </div>
          <h2 class="mt-3 text-2xl sm:text-3xl font-black text-primary">
            {{ netease.personality.archetype }}
          </h2>
          <p class="mt-1 text-sm text-secondary italic">
            {{ netease.personality.tagline }}
          </p>

          <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div
              v-for="f in netease.personality.funStats"
              :key="f.label"
              class="rounded-xl2 bg-surface-tertiary/80 px-3 py-2.5"
            >
              <div class="text-[11px] text-tertiary">{{ f.label }}</div>
              <div class="mt-0.5 font-bold text-primary text-sm">{{ f.value }}</div>
            </div>
          </div>

          <div class="mt-4 border-l-4 pl-3 text-sm text-secondary italic"
            :style="{ borderColor: netease.personality.color }"
          >
            {{ netease.personality.quote }}
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
