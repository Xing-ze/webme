<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Home, BookOpen, Tv, Settings } from 'lucide-vue-next'
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { gsap } from 'gsap'
import { useThemeStore } from '@/composables/useTheme'
import ThemeSwitcher from '@/components/theme/ThemeSwitcher.vue'

// ========== 全局鼠标跟随光晕（Cursor Glow） ==========
const cursorGlowRef = ref<HTMLElement | null>(null)

function onGlowMouseMove(e: MouseEvent) {
  if (!cursorGlowRef.value) return
  const x = e.clientX - 20 // 40px 直径的一半
  const y = e.clientY - 20
  gsap.to(cursorGlowRef.value, {
    x,
    y,
    duration: 0.6,
    ease: 'power3.out',
  })
}

// ========== GSAP 路由过渡钩子 ==========
function onBeforeEnter(el: Element) {
  gsap.set(el as HTMLElement, { opacity: 0, y: 12, filter: 'blur(4px)' })
}
function onEnter(el: Element, done: () => void) {
  gsap.to(el as HTMLElement, {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    duration: 0.28,
    ease: 'power3.out',
    delay: 0.08,
    onComplete: done,
  })
}
function onLeave(el: Element, done: () => void) {
  gsap.to(el as HTMLElement, {
    opacity: 0,
    y: -10,
    filter: 'blur(4px)',
    duration: 0.2,
    ease: 'power2.in',
    onComplete: done,
  })
}

const themeStore = useThemeStore()
const route = useRoute()

// 路由名的中文显示映射
const routeNameMap: Record<string, { label: string; icon: ReturnType<typeof Home> }> = {
  home:      { label: '主页',     icon: Home },
  knowledge: { label: '知识库',   icon: BookOpen },
  media:     { label: '媒体中心', icon: Tv },
  settings:  { label: '设置',     icon: Settings },
}

const navItems = [
  { to: '/',          name: 'home' },
  { to: '/knowledge', name: 'knowledge' },
  { to: '/media',     name: 'media' },
  { to: '/settings',  name: 'settings' },
] as const

// 当前路由对应的中文面包屑名
const currentBreadcrumb = computed(() => {
  const name = String(route.name ?? '')
  return routeNameMap[name]?.label ?? name
})

// ========= 快捷键 T 切换主题 =========
function onKeyDown(e: KeyboardEvent) {
  // 仅在未聚焦输入框时响应
  const tag = (e.target as HTMLElement | null)?.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
  const editable = (e.target as HTMLElement | null)?.isContentEditable
  if (editable) return

  if (e.key === 't' || e.key === 'T') {
    e.preventDefault()
    themeStore.cycleTheme()
  }
}

const isTouchDevice = ref(false)

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  isTouchDevice.value =
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse)').matches
  // 非触摸设备才绑定 cursor-glow 跟随
  if (!isTouchDevice.value) {
    window.addEventListener('mousemove', onGlowMouseMove)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('mousemove', onGlowMouseMove)
})
</script>

<template>
  <div class="min-h-screen w-full bg-surface text-primary transition-colors duration-300">
    <!-- 全局鼠标跟随光晕（仅桌面端显示） -->
    <div
      v-if="!isTouchDevice"
      ref="cursorGlowRef"
      class="fixed top-0 left-0 z-[60] pointer-events-none hidden md:block"
      style="width:40px;height:40px;border-radius:9999px;background:radial-gradient(circle, rgb(var(--color-accent) / 0.18) 0%, transparent 70%);"
    />
    <!-- ==================== 桌面端布局（lg 及以上） ==================== -->
    <div class="hidden lg:flex">
      <!-- 左侧侧边栏 -->
      <aside
        class="sticky top-0 z-50 flex h-screen w-64 flex-shrink-0 flex-col justify-between glass-card m-3 p-5"
      >
        <div class="flex flex-col gap-8">
          <!-- Logo 区 -->
          <div class="flex items-center gap-2.5 pl-2">
            <span class="text-2xl leading-none">🌱</span>
            <span class="text-xl font-bold tracking-tight text-primary">WebMe</span>
          </div>
          <!-- 导航菜单 -->
          <nav class="flex flex-col gap-1.5">
            <RouterLink
              v-for="item in navItems"
              :key="item.name"
              :to="item.to"
              class="group flex items-center gap-3 rounded-xl2 px-4 py-3 text-sm font-medium transition-all duration-200"
              active-class="bg-accent text-white shadow-card"
              inactive-class="text-secondary hover:bg-surface-tertiary hover:text-primary"
            >
              <component
                :is="routeNameMap[item.name].icon"
                class="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
              />
              <span>{{ routeNameMap[item.name].label }}</span>
            </RouterLink>
          </nav>
        </div>
        <!-- 底部 ThemeSwitcher -->
        <div class="flex items-center justify-center pb-1">
          <ThemeSwitcher />
        </div>
      </aside>

      <!-- 右侧内容区 -->
      <section class="flex min-h-screen flex-1 flex-col">
        <!-- 顶部工具栏（面包屑） -->
        <header class="sticky top-0 z-30 bg-surface/80 backdrop-blur-xl">
          <div class="mx-auto flex max-w-6xl items-center px-8 py-5">
            <div class="flex items-center gap-2 text-sm">
              <span class="text-tertiary">WebMe</span>
              <span class="text-tertiary/50">/</span>
              <span class="font-medium text-primary">{{ currentBreadcrumb }}</span>
            </div>
          </div>
        </header>
        <!-- 路由内容 -->
        <main class="mx-auto w-full max-w-6xl flex-1 p-6 perspective-[1000px]">
          <RouterView v-slot="{ Component: RouteComponent, route: activeRoute }">
            <transition
              name="gsap-route"
              mode="out-in"
              @before-enter="onBeforeEnter"
              @enter="onEnter"
              @leave="onLeave"
            >
              <component :is="RouteComponent" :key="activeRoute.fullPath" />
            </transition>
          </RouterView>
        </main>
      </section>
    </div>

    <!-- ==================== 移动端布局（< lg） ==================== -->
    <div class="flex min-h-screen flex-col lg:hidden">
      <!-- 顶部 Header -->
      <header
        class="sticky top-0 z-40 flex items-center justify-between glass-card mx-3 mt-3 px-4 py-3"
      >
        <div class="flex items-center gap-2 text-lg font-semibold tracking-tight text-primary">
          <span>🌱</span>
          <span>WebMe</span>
        </div>
        <ThemeSwitcher />
      </header>

      <!-- 内容 -->
      <main class="flex-1 px-4 pt-5 pb-28 perspective-[1000px]">
        <RouterView v-slot="{ Component: RouteComponent, route: activeRoute }">
          <transition
            name="gsap-route"
            mode="out-in"
            @before-enter="onBeforeEnter"
            @enter="onEnter"
            @leave="onLeave"
          >
            <component :is="RouteComponent" :key="activeRoute.fullPath" />
          </transition>
        </RouterView>
      </main>

      <!-- 底部 Tab 栏 -->
      <nav
        class="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around glass-card mx-3 mb-3 rounded-glass px-2 py-2"
      >
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="item.to"
          class="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-fullButton py-1.5 text-[11px] font-medium transition-all duration-200"
          active-class="text-accent"
          inactive-class="text-secondary"
        >
          <component :is="routeNameMap[item.name].icon" class="h-5 w-5" />
          <span class="hidden sm:block md:hidden">{{ routeNameMap[item.name].label }}</span>
          <span class="hidden md:block">{{ routeNameMap[item.name].label }}</span>
        </RouterLink>
      </nav>
    </div>
  </div>
</template>

<style scoped>
/* GSAP 钩子控制动画，这里仅提供骨架保护 */
.gsap-route-enter-active,
.gsap-route-leave-active {
  /* 由 JS 钩子控制动画，此处留空 */
}
.gsap-route-move {
  transition: transform 250ms ease;
}
</style>
