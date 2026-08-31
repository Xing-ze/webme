export type KnowledgeCategoryId =
  | 'all'
  | 'work'
  | 'study'
  | 'life'
  | 'project'
  | 'reading'
  | 'note'
  | 'other'

export interface KnowledgeCategoryMeta {
  id: KnowledgeCategoryId
  name: string
  icon: string
  color: string
}

export interface KnowledgeNote {
  id?: number
  title: string
  category: Exclude<KnowledgeCategoryId, 'all'>
  tags: string[]
  content: string
  createdAt: number
  updatedAt: number
  pinned?: boolean
  favorite?: boolean
}

export const KNOWLEDGE_CATEGORIES: KnowledgeCategoryMeta[] = [
  { id: 'all',     name: '全部笔记', icon: 'Layers',         color: 'rgb(var(--color-accent))' },
  { id: 'work',    name: '工作',     icon: 'Briefcase',      color: '#0ea5e9' },
  { id: 'study',   name: '学习',     icon: 'GraduationCap',  color: '#8b5cf6' },
  { id: 'life',    name: '生活',     icon: 'Heart',          color: '#ec4899' },
  { id: 'project', name: '项目',     icon: 'FolderGit2',     color: '#22c55e' },
  { id: 'reading', name: '读书',     icon: 'BookOpen',       color: '#f59e0b' },
  { id: 'note',    name: '随手记',   icon: 'StickyNote',     color: '#f43f5e' },
  { id: 'other',   name: '其他',     icon: 'MoreHorizontal', color: '#64748b' },
]

export const CATEGORY_META_MAP = Object.fromEntries(
  KNOWLEDGE_CATEGORIES.map(c => [c.id, c])
) as Record<KnowledgeCategoryId, KnowledgeCategoryMeta>
