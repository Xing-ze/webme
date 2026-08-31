import type {
  MediaDataRoot,
  Bangumi,
  NeteaseAnnualData,
  NeteaseTopSong,
  NeteaseArtistStat,
  NeteaseHourlyPlay,
  NeteaseWeeklyPlay,
  NeteaseGenreShare,
  NeteaseMusicPersonality,
} from '@/types/media'

// ============================================================
// A. Mock 数据工厂
// ============================================================

function coverUrl(title: string): string {
  return (
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20' +
    encodeURIComponent(title) +
    '%20cover%20art%20vibrant%20japanese%20style&image_size=portrait_4_3'
  )
}

export function getMockBangumi(): Bangumi[] {
  return [
    {
      id: 'bgm-001',
      title: '咒术回战 第二季',
      cover: coverUrl('咒术回战 第二季'),
      region: '日本',
      genres: ['战斗', '奇幻', '热血'],
      totalEpisodes: 23,
      watchedEpisodes: 18,
      status: 'watching',
      myScore: 9,
      startDate: '2024-07-06',
      lastWatchText: '怀玉·玉折篇神中神，五条悟被封印了！',
    },
    {
      id: 'bgm-002',
      title: '葬送的芙莉莲',
      cover: coverUrl('葬送的芙莉莲'),
      region: '日本',
      genres: ['奇幻', '治愈', '冒险'],
      totalEpisodes: 28,
      watchedEpisodes: 28,
      status: 'completed',
      myScore: 10,
      startDate: '2024-09-29',
      finishDate: '2025-03-30',
      lastWatchText: '第 28 话「魔法使いの時間」，看哭了',
    },
    {
      id: 'bgm-003',
      title: '药屋少女的呢喃',
      cover: coverUrl('药屋少女的呢喃'),
      region: '日本',
      genres: ['古风', '推理', '日常'],
      totalEpisodes: 24,
      watchedEpisodes: 24,
      status: 'completed',
      myScore: 9,
      startDate: '2024-10-22',
      finishDate: '2025-03-22',
      lastWatchText: '猫猫的表情太有趣了，期待第二季',
    },
    {
      id: 'bgm-004',
      title: '【我推的孩子】',
      cover: coverUrl('我推的孩子'),
      region: '日本',
      genres: ['娱乐圈', '悬疑', '剧情'],
      totalEpisodes: 11,
      watchedEpisodes: 11,
      status: 'completed',
      myScore: 9,
      startDate: '2024-04-12',
      finishDate: '2024-06-28',
      lastWatchText: '第一话神展开，40 分钟时长炸裂',
    },
    {
      id: 'bgm-005',
      title: '间谍过家家',
      cover: coverUrl('间谍过家家'),
      region: '日本',
      genres: ['喜剧', '日常', '家庭'],
      totalEpisodes: 25,
      watchedEpisodes: 12,
      status: 'watching',
      myScore: 8,
      startDate: '2025-05-10',
      lastWatchText: '看到第 12 话，安妮亚花生吃播',
    },
    {
      id: 'bgm-006',
      title: '赛博朋克：边缘行者',
      cover: coverUrl('赛博朋克 边缘行者'),
      region: '日本',
      genres: ['科幻', '赛博朋克', '热血'],
      totalEpisodes: 10,
      watchedEpisodes: 10,
      status: 'completed',
      myScore: 9,
      startDate: '2024-09-15',
      finishDate: '2024-09-20',
      lastWatchText: '一口气看完，大卫永远在夜之城闪耀',
    },
    {
      id: 'bgm-007',
      title: '进击的巨人 最终季',
      cover: coverUrl('进击的巨人 最终季'),
      region: '日本',
      genres: ['热血', '剧情', '战斗'],
      totalEpisodes: 87,
      watchedEpisodes: 60,
      status: 'on_hold',
      myScore: 8,
      startDate: '2024-02-01',
      lastWatchText: '看了 60 话节奏有点拖，先放一放',
    },
    {
      id: 'bgm-008',
      title: '莉可丽丝',
      cover: coverUrl('莉可丽丝'),
      region: '日本',
      genres: ['战斗', '美少女', '日常'],
      totalEpisodes: 13,
      watchedEpisodes: 5,
      status: 'dropped',
      myScore: 7,
      startDate: '2024-08-01',
      lastWatchText: '感觉剧情有点迷，弃坑了',
    },
    {
      id: 'bgm-009',
      title: '孤独摇滚！',
      cover: coverUrl('孤独摇滚'),
      region: '日本',
      genres: ['音乐', '日常', '喜剧'],
      totalEpisodes: 12,
      watchedEpisodes: 0,
      status: 'plan',
      myScore: undefined,
      lastWatchText: '听说是神番，抽时间一口气补完',
    },
    {
      id: 'bgm-010',
      title: '黑神话：悟空 动画版',
      cover: coverUrl('黑神话 悟空 动画'),
      region: '国产',
      genres: ['国产', '奇幻', '动作'],
      totalEpisodes: 12,
      watchedEpisodes: 0,
      status: 'plan',
      lastWatchText: '游戏都打爆了，动画必看',
    },
  ]
}

function buildHourly(): NeteaseHourlyPlay {
  // 凌晨少，中午 12 点小峰，晚上 19~23 最高峰
  const hours = [
    180, 120, 60, 30, 20, 15, 25, 60,        // 0-7 点
    180, 260, 320, 380, 520, 360, 300, 320,  // 8-15 点
    380, 460, 620, 880, 1080, 980, 720, 420, // 16-23 点
  ]
  return { hours }
}

function buildWeekly(): NeteaseWeeklyPlay {
  // 周一 ~ 周日，周末稍多
  return { days: [3400, 3200, 3500, 3350, 3800, 5200, 4890] }
}

function buildGenres(): NeteaseGenreShare[] {
  return [
    { name: '流行', minutes: 9820 },
    { name: '日系', minutes: 6380 },
    { name: '古风', minutes: 3520 },
    { name: '轻音乐', minutes: 3040 },
    { name: '摇滚', minutes: 2360 },
    { name: '说唱', minutes: 1840 },
    { name: '电子', minutes: 1380 },
  ]
}

function buildTopSongs(): NeteaseTopSong[] {
  const raw: Array<Omit<NeteaseTopSong, 'id' | 'playCount'> & { pc: number }> = [
    { pc: 298, name: '晴天', artists: ['周杰伦'], album: '叶惠美', durationSec: 269 },
    { pc: 265, name: '夜曲', artists: ['周杰伦'], album: '十一月的萧邦', durationSec: 226 },
    { pc: 232, name: '海阔天空', artists: ['Beyond'], album: '海阔天空', durationSec: 326 },
    { pc: 205, name: '残酷な天使のテーゼ', artists: ['高橋洋子'], album: 'EVA 主题曲合集', durationSec: 255 },
    { pc: 184, name: '千本樱', artists: ['初音ミク', '黒うさP'], album: 'EXIT TUNES PRESENTS', durationSec: 242 },
    { pc: 168, name: '稻香', artists: ['周杰伦'], album: '魔杰座', durationSec: 223 },
    { pc: 148, name: '青花瓷', artists: ['周杰伦'], album: '我很忙', durationSec: 239 },
    { pc: 132, name: '红昭愿', artists: ['音阙诗听', '王梓钰'], album: '红昭愿', durationSec: 180 },
    { pc: 118, name: '光年之外', artists: ['邓紫棋'], album: '光年之外', durationSec: 235 },
    { pc: 105, name: 'Lemon', artists: ['米津玄师'], album: 'Lemon', durationSec: 256 },
    { pc: 92, name: '打上花火', artists: ['DAOKO', '米津玄师'], album: '打上花火', durationSec: 270 },
    { pc: 81, name: '成都', artists: ['赵雷'], album: '成都', durationSec: 328 },
    { pc: 72, name: '追光者', artists: ['岑宁儿'], album: '夏至未至 OST', durationSec: 273 },
    { pc: 61, name: '不染', artists: ['毛不易'], album: '香蜜沉沉烬如霜 OST', durationSec: 314 },
    { pc: 52, name: '起风了', artists: ['买辣椒也用券'], album: '起风了', durationSec: 326 },
  ]
  return raw.map((r, i) => ({
    id: `song-${String(i + 1).padStart(3, '0')}`,
    name: r.name,
    artists: r.artists,
    album: r.album,
    playCount: r.pc,
    durationSec: r.durationSec,
  }))
}

function buildTopArtists(): NeteaseArtistStat[] {
  const raw = [
    { name: '周杰伦', pc: 1520, genre: '流行' },
    { name: '米津玄师', pc: 1180, genre: '日系' },
    { name: '陈奕迅', pc: 940, genre: '流行' },
    { name: '林俊杰', pc: 760, genre: '流行' },
    { name: '邓紫棋', pc: 610, genre: '流行' },
    { name: 'YOASOBI', pc: 480, genre: '日系' },
    { name: '毛不易', pc: 380, genre: '民谣' },
    { name: '初音ミク', pc: 310, genre: '日系' },
    { name: '音阙诗听', pc: 210, genre: '古风' },
    { name: 'Beyond', pc: 115, genre: '摇滚' },
  ]
  return raw.map(r => ({
    name: r.name,
    playCount: r.pc,
    genre: r.genre,
  }))
}

function buildPersonality(): NeteaseMusicPersonality {
  return {
    archetype: '深夜文艺青年',
    color: '#6366f1',
    tagline: '白天不懂夜的黑 · 凌晨 1 点你在听谁',
    emoji: '🌙',
    funStats: [
      { label: '年度最早听歌', value: '06:12' },
      { label: '年度最晚听歌', value: '03:28' },
      { label: '最爱歌手循环', value: '周杰伦 1520 次' },
      { label: '单曲年度重复', value: '晴天 298 遍' },
    ],
    quote: '「最美的不是下雨天，是曾与你躲过雨的屋檐。」',
  }
}

export function getMockNetease(): NeteaseAnnualData {
  return {
    year: 2025,
    totalPlayMinutes: 28340,
    totalPlayCount: 6842,
    totalSongs: 1238,
    totalArtists: 326,
    mostActiveDay: '2025-07-20',
    topSongs: buildTopSongs(),
    topArtists: buildTopArtists(),
    hourly: buildHourly(),
    weekly: buildWeekly(),
    genres: buildGenres(),
    personality: buildPersonality(),
  }
}

export function buildDefaultRoot(): MediaDataRoot {
  return {
    version: '1.0',
    exportAt: new Date().toISOString(),
    bangumi: getMockBangumi(),
    netease: getMockNetease(),
  }
}

// ============================================================
// B. MediaService 抽象与实现
// ============================================================

export interface IMediaService {
  load(): Promise<MediaDataRoot>
  importData(root: MediaDataRoot): Promise<void>
  resetToDefault(): Promise<void>
  getTemplate(): MediaDataRoot
}

const STORAGE_KEY = 'webme-media-json'

function isValidRoot(v: unknown): v is MediaDataRoot {
  if (!v || typeof v !== 'object') return false
  const o = v as Record<string, unknown>
  return (
    o.version === '1.0' &&
    Array.isArray(o.bangumi) &&
    !!o.netease &&
    typeof o.netease === 'object'
  )
}

class LocalMediaService implements IMediaService {
  async load(): Promise<MediaDataRoot> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as unknown
        if (isValidRoot(parsed)) return parsed
      }
    } catch {
      /* ignore */
    }
    return buildDefaultRoot()
  }

  async importData(root: MediaDataRoot): Promise<void> {
    if (!isValidRoot(root)) {
      throw new Error('导入失败：数据格式不合法，缺少 version / bangumi / netease 字段')
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(root))
  }

  async resetToDefault(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY)
  }

  getTemplate(): MediaDataRoot {
    return buildDefaultRoot()
  }
}

export const mediaService: IMediaService = new LocalMediaService()
