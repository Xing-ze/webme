import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { MediaDataRoot, BangumiStatus, Bangumi } from '@/types/media'
import { BANGUMI_STATUS, BANGUMI_STATUS_MAP } from '@/types/media'
import { mediaService } from '@/services/mediaService'

export const useMediaStore = defineStore('media', () => {
  // ============ state ============
  const data = ref<MediaDataRoot | null>(null)
  const loading = ref(false)
  const importError = ref('')

  let _errorTimer: number | null = null

  function setImportError(msg: string) {
    importError.value = msg
    if (_errorTimer) window.clearTimeout(_errorTimer)
    if (msg.length > 0) {
      _errorTimer = window.setTimeout(() => {
        importError.value = ''
        _errorTimer = null
      }, 3000)
    }
  }

  // ============ getters ============
  const bangumiByStatus = computed<Record<BangumiStatus, Bangumi[]>>(() => {
    const result = {} as Record<BangumiStatus, Bangumi[]>
    for (const s of BANGUMI_STATUS) {
      result[s.id] = []
    }
    for (const b of data.value?.bangumi ?? []) {
      const arr = result[b.status]
      if (arr) arr.push(b)
    }
    return result
  })

  const bangumiStatusCounts = computed<Record<BangumiStatus, number>>(() => {
    const counts = {} as Record<BangumiStatus, number>
    for (const s of BANGUMI_STATUS) {
      counts[s.id] = bangumiByStatus.value[s.id].length
    }
    return counts
  })

  const bangumiTotalWatchedRatio = computed<number>(() => {
    const list = data.value?.bangumi ?? []
    if (list.length === 0) return 0
    let total = 0
    let watched = 0
    for (const b of list) {
      if (b.totalEpisodes > 0) {
        total += b.totalEpisodes
        watched += Math.min(b.watchedEpisodes, b.totalEpisodes)
      }
    }
    if (total === 0) return 0
    return watched / total
  })

  const neteaseSummaryStats = computed(() => {
    const n = data.value?.netease
    if (!n) {
      return {
        totalHoursText: '0 小时 0 分钟',
        totalDaysText: '0 天 0 小时',
        totalPlayCount: 0,
        totalSongs: 0,
        totalArtists: 0,
      }
    }
    const minutes = n.totalPlayMinutes
    const hours = Math.floor(minutes / 60)
    const remainMin = minutes % 60
    const days = Math.floor(hours / 24)
    const remainHour = hours % 24
    return {
      totalHoursText: `${hours} 小时 ${remainMin} 分钟`,
      totalDaysText: `${days} 天 ${remainHour} 小时`,
      totalPlayCount: n.totalPlayCount,
      totalSongs: n.totalSongs,
      totalArtists: n.totalArtists,
    }
  })

  // ============ actions ============
  async function load() {
    if (loading.value) return
    loading.value = true
    try {
      data.value = await mediaService.load()
    } finally {
      loading.value = false
    }
  }

  async function importJsonFromFile(file: File) {
    try {
      const text = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(reader.error ?? new Error('读取文件失败'))
        reader.readAsText(file, 'utf-8')
      })
      const obj = JSON.parse(text) as unknown
      await mediaService.importData(obj as any)
      await load()
      setImportError('')
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      setImportError(msg || '导入失败')
    }
  }

  async function reset() {
    await mediaService.resetToDefault()
    await load()
  }

  function downloadTemplate() {
    const tpl = mediaService.getTemplate()
    const blob = new Blob([JSON.stringify(tpl, null, 2)], {
      type: 'application/json;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'webme-media-template.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  function ensureLoaded() {
    if (data.value === null && !loading.value) {
      load()
    }
  }

  return {
    // state
    data,
    loading,
    importError,
    // getters
    bangumiByStatus,
    bangumiStatusCounts,
    bangumiTotalWatchedRatio,
    neteaseSummaryStats,
    // actions
    load,
    importJsonFromFile,
    reset,
    downloadTemplate,
    ensureLoaded,
    // 暴露给组件使用的元数据（避免重复 import）
    BANGUMI_STATUS,
    BANGUMI_STATUS_MAP,
  }
})
