import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from '@/db/index'
import type { KnowledgeNote, KnowledgeCategoryId } from '@/types/knowledge'
import { KNOWLEDGE_CATEGORIES } from '@/types/knowledge'

function dedupe(arr: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const item of arr) {
    const trimmed = item.trim()
    if (!trimmed) continue
    if (!seen.has(trimmed.toLowerCase())) {
      seen.add(trimmed.toLowerCase())
      result.push(trimmed)
    }
  }
  return result
}

export const useKnowledgeStore = defineStore('knowledge', () => {
  // ============ state ============
  const notes = ref<KnowledgeNote[]>([])
  const activeCategory = ref<KnowledgeCategoryId>('all')
  const searchKeyword = ref('')
  const loading = ref(false)
  const favoritesOnly = ref(false)
  const _seeded = ref(false)

  // ============ getters ============
  const filteredNotes = computed<KnowledgeNote[]>(() => {
    let list = notes.value

    if (activeCategory.value !== 'all') {
      list = list.filter(n => n.category === activeCategory.value)
    }

    if (favoritesOnly.value) {
      list = list.filter(n => n.favorite === true)
    }

    const kw = searchKeyword.value.trim().toLowerCase()
    if (kw.length > 0) {
      list = list.filter(n => {
        const inTitle = n.title.toLowerCase().includes(kw)
        const inContent = n.content.toLowerCase().includes(kw)
        const inTags = n.tags.some(t => t.toLowerCase().includes(kw))
        return inTitle || inContent || inTags
      })
    }

    const pinned = list.filter(n => n.pinned === true)
      .sort((a, b) => b.updatedAt - a.updatedAt)
    const unpinned = list.filter(n => n.pinned !== true)
      .sort((a, b) => b.updatedAt - a.updatedAt)
    return [...pinned, ...unpinned]
  })

  const categoryCounts = computed<Record<KnowledgeCategoryId, number>>(() => {
    const counts: Record<string, number> = { all: notes.value.length }
    for (const cat of KNOWLEDGE_CATEGORIES) {
      if (cat.id === 'all') continue
      counts[cat.id] = 0
    }
    for (const n of notes.value) {
      counts[n.category] = (counts[n.category] ?? 0) + 1
    }
    return counts as Record<KnowledgeCategoryId, number>
  })

  const emptyStateText = computed(() => {
    const kw = searchKeyword.value.trim()
    if (kw.length > 0) {
      return { msg: '没有匹配的搜索结果', desc: `关键词「${kw}」没有找到相关笔记，换个关键词试试？` }
    }
    if (favoritesOnly.value) {
      return { msg: '还没有收藏的笔记', desc: '点击卡片上的 ⭐ 把喜欢的笔记收藏起来吧。' }
    }
    if (activeCategory.value !== 'all') {
      const cat = KNOWLEDGE_CATEGORIES.find(c => c.id === activeCategory.value)
      return { msg: `「${cat?.name ?? '当前分类'}」下还没有笔记`, desc: '点击右上角「新建笔记」开始记录吧。' }
    }
    return { msg: '知识库还是空的', desc: '点击右上角「新建笔记」开始整理你的第一篇知识卡片吧。' }
  })

  // ============ seed ============
  async function seedNotes() {
    if (_seeded.value) return
    const now = Date.now()
    const hour = 3600_000
    const samples: Omit<KnowledgeNote, 'id'>[] = [
      {
        title: 'Airtest 图像识别脚本模板',
        category: 'work',
        tags: ['自动化测试', 'Airtest', 'Python', '图像识别'],
        content:
`# Airtest 基础脚本模板

1. 初始化连接：
auto_setup(__file__, logdir=True, devices=["Android:///"])

2. 图像断言 + 点击：
assert_exists(Template(r"tpl1640000000000.png", threshold=0.8), "未找到目标按钮")
touch(Template(r"tpl1640000000001.png"))

3. 文字断言：
assert_equal(poco("title").get_text(), "首页", "标题校验")

# 注意事项
- 图像尽量剪裁紧凑，背景干净
- 阈值 threshold 一般 0.75~0.85 之间
- 游戏 UI 用 poco / 原生 App 用 Android/iOS 原生对象`,
        createdAt: now - 72 * hour,
        updatedAt: now - 4 * hour,
        pinned: true,
        favorite: true,
      },
      {
        title: 'Python 装饰器小结',
        category: 'study',
        tags: ['Python', '装饰器', '语法糖'],
        content:
`# 装饰器本质
装饰器 = 返回函数的高阶函数。

def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(func.__name__, time.time() - start)
        return result
    return wrapper

@timer
def slow():
    time.sleep(1)

# 带参数装饰器
def repeat(n=2):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*a, **kw):
            for _ in range(n): func(*a, **kw)
        return wrapper
    return decorator

记忆要点：
- functools.wraps 保留原函数元信息
- 类装饰器：实现 __call__ 即可
- 多个装饰器：从离函数最近的开始执行`,
        createdAt: now - 48 * hour,
        updatedAt: now - 20 * hour,
        pinned: false,
        favorite: false,
      },
      {
        title: 'WebMe 个人站开发 TODO',
        category: 'project',
        tags: ['Vue', 'Taro', '路线图', '项目'],
        content:
`# WebMe 开发进度

已完成：
✅ 阶段一：项目脚手架 + 主题系统（4 套主题）
✅ 阶段二：首页动画（Hero / Skills / Timeline）
✅ 阶段三：知识库 CRUD + IndexedDB 持久化（进行中）

待做：
⬜ 知识库：Markdown 富文本渲染（+ 代码高亮）
⬜ 知识库：标签云 / 导出 Markdown
⬜ 阶段四：Media 页面（画廊 + 视频列表）
⬜ 阶段五：Settings 高级设置（导出数据、关于）
⬜ 阶段六：Taro 小程序端复用组件

长期：
· 多端：桌面 Electron / App UniApp
· 协作：多人知识库（换 Supabase 或自建后端）`,
        createdAt: now - 24 * hour,
        updatedAt: now - 2 * hour,
        pinned: true,
        favorite: true,
      },
      {
        title: '《游戏测试之道》第一章摘录',
        category: 'reading',
        tags: ['读书', '游戏测试', '质量保障'],
        content:
`📖 书名：《游戏测试之道》
作者：某大厂测试团队

## 第一章：游戏测试的特殊性
- 强交互性：传统软件流程化 → 游戏是实时状态机
- 体验优先：功能正确 ≠ 体验好玩，需引入主观评估
- 数据驱动：留存/付费/崩溃率 三大核心指标

## 测试金字塔（游戏版）
1. 单元测试：核心战斗公式、数值计算（占 60%）
2. 集成测试：模块组合（关卡流程、登录串联，占 25%）
3. 端到端自动化：Airtest / Playwright 冒烟回归（占 10%）
4. 人工探索：真实玩家视角体验、BUG 深挖（占 5%）

金句："数值没验证过的版本，不要让策划看。"`,
        createdAt: now - 96 * hour,
        updatedAt: now - 50 * hour,
        pinned: false,
        favorite: false,
      },
      {
        title: '常用抓包命令备忘',
        category: 'note',
        tags: ['抓包', '命令行', 'Charles', '调试'],
        content:
`📌 命令行抓包速查

# 1. tcpdump (Linux/macOS)
sudo tcpdump -i any -w dump.pcap host 192.168.1.10 and port 8080
sudo tcpdump -i en0 -nn -s0 -A port 443 | grep -i "cookie"

# 2. mitmproxy (推荐移动端调试)
mitmproxy --listen-port 8888 --set block_global=false
mitmweb  # web 版 UI

# 3. curl 常用
curl -v -x http://127.0.0.1:8888 https://api.example.com  # 走代理
curl -H "Authorization: Bearer xxx" -d '{"a":1}' -X POST https://...

# 4. Charles 技巧
- SSL Proxying Settings 里勾选 Enable，再 Add 域名 *:443
- 手机安装证书后，始终信任根证书
- Rewrite 工具可以改包体，Mock 错误返回码

小提醒：抓不到 HTTPS = 证书没装好 / 没开启 SSL Proxy。`,
        createdAt: now - 10 * hour,
        updatedAt: now - 1 * hour,
        pinned: false,
        favorite: true,
      },
    ]

    try {
      await db.notes.bulkAdd(samples as any)
    } catch (e) {
      // 忽略唯一约束冲突（理论上不会，自增主键）
    }
    _seeded.value = true
  }

  // ============ actions ============
  async function loadNotes() {
    if (loading.value) return
    loading.value = true
    try {
      notes.value = await db.notes.orderBy('updatedAt').reverse().toArray()
      if (notes.value.length === 0 && !_seeded.value) {
        await seedNotes()
        notes.value = await db.notes.orderBy('updatedAt').reverse().toArray()
      }
    } finally {
      loading.value = false
    }
  }

  async function createNote(
    input: Pick<KnowledgeNote, 'title' | 'category' | 'tags' | 'content'> &
      Partial<Pick<KnowledgeNote, 'pinned' | 'favorite'>>
  ): Promise<number> {
    const trimmedTitle = (input.title ?? '').trim()
    if (trimmedTitle.length === 0) {
      throw new Error('标题不能为空')
    }
    const now = Date.now()
    const note: Omit<KnowledgeNote, 'id'> = {
      title: trimmedTitle,
      category: input.category,
      tags: dedupe(input.tags ?? []),
      content: input.content ?? '',
      createdAt: now,
      updatedAt: now,
      pinned: input.pinned ?? false,
      favorite: input.favorite ?? false,
    }
    const id = await db.notes.add(note as any)
    await loadNotes()
    return id as number
  }

  async function updateNote(
    id: number,
    patch: Partial<Pick<KnowledgeNote, 'title' | 'category' | 'tags' | 'content' | 'pinned' | 'favorite'>>
  ) {
    if (patch.title !== undefined) {
      const trimmed = patch.title.trim()
      if (trimmed.length === 0) throw new Error('标题不能为空')
      patch.title = trimmed
    }
    if (patch.tags !== undefined) {
      patch.tags = dedupe(patch.tags)
    }
    const newUpdatedAt = Date.now()
    await db.notes.update(id, { ...patch, updatedAt: newUpdatedAt })
    await loadNotes()
  }

  async function deleteNote(id: number) {
    await db.notes.delete(id)
    await loadNotes()
  }

  async function togglePin(id: number) {
    const note = notes.value.find(n => n.id === id)
    if (!note) return
    await updateNote(id, { pinned: !note.pinned })
  }

  async function toggleFavorite(id: number) {
    const note = notes.value.find(n => n.id === id)
    if (!note) return
    await updateNote(id, { favorite: !note.favorite })
  }

  function setActiveCategory(id: KnowledgeCategoryId) {
    activeCategory.value = id
  }
  function setSearchKeyword(keyword: string) {
    searchKeyword.value = keyword
  }
  function toggleFavoritesOnly() {
    favoritesOnly.value = !favoritesOnly.value
  }

  function ensureLoaded() {
    if (notes.value.length === 0 && !loading.value) {
      loadNotes()
    }
  }

  return {
    // state
    notes,
    activeCategory,
    searchKeyword,
    loading,
    favoritesOnly,
    // getters
    filteredNotes,
    categoryCounts,
    emptyStateText,
    // actions
    loadNotes,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    toggleFavorite,
    setActiveCategory,
    setSearchKeyword,
    toggleFavoritesOnly,
    ensureLoaded,
  }
})
