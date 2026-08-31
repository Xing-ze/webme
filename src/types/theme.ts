export type ThemeId = 'light' | 'dark' | 'colorful' | 'glass'

export interface ThemeMeta {
  id: ThemeId
  name: string        // 中文名字，例如"日光浅色"
  description: string // 一句简短介绍
  icon: string        // 对应 lucide 图标名：sun / moon / palette / sparkle
}

export const THEMES: ThemeMeta[] = [
  { id: 'light',    name: '日光浅色', description: '苹果官网风格，干净清爽',   icon: 'sun' },
  { id: 'dark',     name: '低调暗色', description: '深灰护眼，深夜友好',     icon: 'moon' },
  { id: 'colorful', name: '缤纷彩色', description: '渐变活力，色彩丰富',     icon: 'palette' },
  { id: 'glass',    name: '磨砂玻璃', description: '毛玻璃卡片，现代质感',   icon: 'sparkles' },
]
