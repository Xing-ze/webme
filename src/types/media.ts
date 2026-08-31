// ====== B 站追番 ======
export type BangumiStatus = 'watching' | 'completed' | 'plan' | 'on_hold' | 'dropped'

export interface Bangumi {
  id: string                 // 唯一 id
  title: string              // 番剧名
  cover: string              // 封面图 URL（先用 text_to_image 生成的占位图）
  region?: string            // 地区：日本/国产/欧美
  genres?: string[]          // 标签：科幻、恋爱、日常…
  totalEpisodes: number      // 总集数
  watchedEpisodes: number    // 已看集数
  status: BangumiStatus      // 追番状态
  myScore?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10  // 1-10 我的评分
  startDate?: string         // 开始追番 YYYY-MM-DD
  finishDate?: string        // 看完日期
  lastWatchText?: string     // 自由文本：如「看到第 12 话，神回」
}

// ====== 网易云音乐 ======
export interface NeteaseTopSong {
  id: string
  name: string
  artists: string[]         // 作者，可能多个
  album: string
  playCount: number          // 该年度播放次数（用于排序）
  durationSec: number        // 歌曲时长秒，可不填
  cover?: string             // 专辑封面
}

export interface NeteaseArtistStat {
  name: string
  playCount: number          // 该艺人年度播放总次数
  genre?: string
  cover?: string
}

export interface NeteaseHourlyPlay {
  /** length=24，索引 0~23 对应 0 点到 23 点，值是该小时总播放分钟数 */
  hours: number[]
}

export interface NeteaseWeeklyPlay {
  /** length=7，顺序：周一、周二、周三、周四、周五、周六、周日 */
  days: number[]             // 每天总播放分钟
}

export interface NeteaseGenreShare {
  /** 音乐风格占比（饼图数据） */
  name: string               // 流派：流行 / 摇滚 / 轻音乐 / 日系 / 古风 / 说唱 …
  minutes: number            // 年度总分钟数
}

export interface NeteaseMusicPersonality {
  /** 音乐人格趣味彩蛋 */
  archetype: string          // 如「深夜文艺青年」「周末燃曲战士」「二次元歌姬」「怀旧金曲收藏家」
  color: string              // 主色（十六进制）
  tagline: string            // 一句 tagline，如「白天不懂夜的黑 · 凌晨 1 点你在听谁」
  funStats: { label: string; value: string }[]  // 4 条趣味统计
  quote: string              // 一句灵魂拷问/歌词
  emoji: string              // 对应的 emoji
}

export interface NeteaseAnnualData {
  year: number               // 年份，如 2025
  totalPlayMinutes: number   // 年度总听歌分钟（大数字展示）
  totalPlayCount: number     // 年度总播放次数
  totalSongs: number         // 年度听了多少首不同歌曲
  totalArtists: number       // 年度接触了多少位歌手
  mostActiveDay?: string     // YYYY-MM-DD 听歌最多那一天
  topSongs: NeteaseTopSong[]             // Top 20 就行
  topArtists: NeteaseArtistStat[]        // Top 10
  hourly: NeteaseHourlyPlay              // 24h 热力
  weekly: NeteaseWeeklyPlay              // 周 7 日
  genres: NeteaseGenreShare[]            // 流派饼图（环形）≥6 个
  personality: NeteaseMusicPersonality   // 趣味音乐人格
}

// ====== 根媒体数据（整体导入 JSON 的 schema） ======
export interface MediaDataRoot {
  version: '1.0'
  exportAt: string           // ISO 时间戳
  bangumi: Bangumi[]
  netease: NeteaseAnnualData
}

// ====== B 站状态元数据常量 ======
export interface BangumiStatusMeta {
  id: BangumiStatus
  name: string               // 中文：在看 / 看完 / 想看 / 搁置 / 抛弃
  color: string              // 十六进制色
  icon: string               // lucide 图标名
}
export const BANGUMI_STATUS: BangumiStatusMeta[] = [
  { id: 'watching',  name: '在看',   color: '#fb7299', icon: 'Play' },        // B 站粉
  { id: 'completed', name: '看完',   color: '#22c55e', icon: 'CircleCheck' }, // 绿
  { id: 'plan',      name: '想看',   color: '#60a5fa', icon: 'Bookmark' },    // 蓝
  { id: 'on_hold',   name: '搁置',   color: '#f59e0b', icon: 'Pause' },       // 琥珀
  { id: 'dropped',   name: '放弃',   color: '#ef4444', icon: 'XCircle' },     // 红
]
export const BANGUMI_STATUS_MAP = Object.fromEntries(
  BANGUMI_STATUS.map(s => [s.id, s])
) as Record<BangumiStatus, BangumiStatusMeta>
