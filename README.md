# 🌱 WebMe — 个人数字空间

> 一个遵循苹果设计语言、集个人展示 · 知识库 · 媒体数据聚合于一体的个人网站

[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vuedotjs&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](#)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](#)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white)](#)
[![License](https://img.shields.io/github/license/Xing-ze/webme)](LICENSE)

---

## ✨ 功能特性

### 🏠 个人主页
- 精美 Hero 区：头像 + 姓名 + 职位 + 社交链接
- 技能标签云 + 关于我介绍
- 工作 / 教育经历时间线
- 滚动触发的入场动画

### 📚 个人知识库
- ✅ 增删改查完整 CRUD
- 分类 + 标签多维组织
- 实时搜索（标题 / 内容 / 标签模糊匹配）
- IndexedDB 本地持久化，**刷新不丢失**
- 预留 Markdown 渲染接口

### 🎬 媒体数据中心（趣味 Tab）
- **B 站追番管理**
  - 概览仪表盘：总数 / 状态饼图 / 评分分布图
  - 番剧墙卡片网格，hover 动效
  - 按状态 · 评分 · 标签筛选
  - 详情抽屉（进度 · 评分 · 备注）
- **🎵 网易云音乐聚合**
  - 🏆 年度 Top 歌曲榜 / Top 歌手榜（带播放次数进度条动画）
  - 📊 总听歌时长 · 日均时长环形图
  - 🕐 24h / 每周听歌时段热力图
  - 🎭 音乐风格分布树图
  - 📜 倒序听歌记录时间轴
  - 🎪 「音乐人格」趣味分析彩蛋
- **数据导入**：JSON 文件导入 / 粘贴导入，提供模板下载
- **预留接口**：`MediaService` 抽象层，后续可接入真实 API 爬虫

### 🎨 多主题切换（苹果设计风格）
| 主题 | 描述 |
|------|------|
| ☀️ 日光浅色 | 苹果官网风格白底，清爽干净 |
| 🌙 低调暗色 | 深灰背景 · 护眼配色 |
| 🎨 缤纷彩色 | 渐变背景 + 活力多彩元素 |
| ✨ 磨砂玻璃 | 半透明毛玻璃卡片 + 背景模糊 |

- CSS Variables + Tailwind 原子化驱动，**零延迟切换**
- 主题偏好 localStorage 持久化

### 🎬 交互动画
- 路由切换 · 弹窗 · 抽屉 · Tab 过渡动画
- GSAP ScrollTrigger 滚动入场
- 按钮 / 卡片 / 输入框全局微交互（hover · click · focus）
- ECharts 图表数据渐长绘制动画
- 骨架屏 Loading 态

---

## 🛠️ 技术栈

| 分类 | 技术 | 说明 |
|------|------|------|
| 框架 | **Vue 3 (Composition API) + TypeScript** | 现代 · 类型安全 |
| 构建 | **Vite 6** | 极速冷启动 & HMR |
| 样式 | **Tailwind CSS 3 + CSS Variables** | 原子化 + 主题系统 |
| 路由 | **Vue Router 4** | SPA 路由 + 懒加载 |
| 状态 | **Pinia** | 轻量 TS 友好状态管理 |
| 动画 | **GSAP 3 + Vue Transition** | 滚动 · 交互动画 |
| 图表 | **Apache ECharts 5** | 音乐 / 番剧数据可视化 |
| 图标 | **Lucide Vue Next** | 线性简洁风格 |
| 存储 | **Dexie.js** | IndexedDB 封装，知识库持久化 |

---

## 🚀 快速开始

### 环境要求
- Node.js `>= 20.19` 或 `>= 22.12`
- npm / pnpm / bun 任选

### 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器 (默认 http://localhost:5173)
npm run dev
```

### 构建生产包
```bash
# 类型检查 + 构建
npm run build

# 本地预览产物
npm run preview
```

---

## 📁 项目结构
```
webme/
├── public/                 # 静态资源
├── src/
│   ├── assets/             # 图片 · 字体等资源
│   ├── components/         # 通用组件 (BaseCard / BaseButton …)
│   │   └── common/
│   ├── views/              # 页面级组件
│   │   ├── Home.vue        # 个人主页
│   │   ├── Knowledge.vue   # 知识库
│   │   └── Media/          # 媒体数据中心 (Bilibili / Netease)
│   ├── layouts/            # 布局组件 (Sidebar / Topbar / MobileTab)
│   ├── router/             # Vue Router 配置
│   ├── stores/             # Pinia Stores (theme / knowledge / media)
│   ├── composables/        # 组合式函数 (useKnowledge / useTheme …)
│   ├── services/           # 服务抽象层 (MediaService)
│   ├── db/                 # Dexie IndexedDB 定义
│   ├── data/               # 静态初始数据 (profile.ts / 示例 JSON)
│   ├── styles/             # 全局样式 · Tailwind · 主题变量
│   ├── types/              # TypeScript 类型定义
│   ├── utils/              # 工具函数
│   ├── App.vue
│   ├── main.ts
│   └── env.d.ts
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts      # Tailwind 主题色映射
├── postcss.config.js
├── package.json
├── LICENSE
└── README.md
```

---

## 🗺️ 开发路线图

```
✅ Phase 0: 仓库初始化 & Vite + Vue3 脚手架搭建
⬜ Phase 1: 基础架构 — Tailwind · Pinia · Router · 多主题系统 · 通用布局
⬜ Phase 2: 个人主页 — Hero · 技能 · 经历时间线 · 入场动画
⬜ Phase 3: 知识库模块 — IndexedDB · CRUD · 分类搜索
⬜ Phase 4: 媒体数据中心 — B站追番 · 网易云数据可视化 · JSON 导入
⬜ Phase 5: 动画精修 — ScrollTrigger · 微交互 · 骨架屏 · 性能优化
⬜ Phase 6: 收尾部署 — 移动端适配 · PWA · 构建优化 · Vercel/GH Pages
```

---

## 🤝 开发约定

### Git 工作流
- **分支策略**：主开发在 `main`，大功能可开 `feature/*` 分支
- **提交规范**：`<type>: <中文描述>`
  - `feat` 新功能 · `fix` 修复 · `chore` 构建/工具 · `docs` 文档
  - `style` 样式 · `refactor` 重构 · `perf` 性能 · `test` 测试
- **示例**：
  ```
  feat: 集成 Pinia 与 ThemeStore 实现 4 套主题切换
  fix: 修复移动端底部导航点击无反馈
  chore: 升级 Vite 到 6.0 并优化构建配置
  ```

### 代码规范
- 遵循 Vue 3 `<script setup lang="ts">` 风格
- 所有颜色通过 **CSS Variables** 定义，禁止硬编码色值（保障主题切换）
- 动画时长建议：过渡 150~250ms，图表绘制 ≤ 800ms
- `.vue` 单文件结构：`<script setup>` → `<template>` → `<style scoped>`

---

## 📄 License

MIT © [Xing-ze](https://github.com/Xing-ze)
