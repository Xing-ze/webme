<script setup lang="ts">
import { onBeforeUnmount, onMounted, computed, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Sparkles } from 'lucide-vue-next'
import profile from '@/data/profile'
import type { Skill } from '@/data/profile'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)
const pillRefs = ref<Array<HTMLElement | null>>([])

// category 顺序：program, engine, test, tool, perf, collab
const categoryOrder: Skill['category'][] = [
  'program',
  'engine',
  'test',
  'tool',
  'perf',
  'collab',
]
const categoryLabel: Record<Skill['category'], string> = {
  program: '编程语言',
  engine: '游戏引擎',
  test: '测试框架',
  tool: '抓包工具',
  perf: '性能分析',
  collab: '协作工具',
}

// 按 category 分组的技能（保持原顺序）
const groupedSkills = computed(() => {
  const result: { category: Skill['category']; label: string; items: Skill[] }[] =
    []
  for (const c of categoryOrder) {
    const items = profile.skills.filter((s) => s.category === c)
    if (items.length > 0) {
      result.push({ category: c, label: categoryLabel[c], items })
    }
  }
  return result
})

const totalSkills = computed(() => profile.skills.length)
const masterCount = computed(
  () => profile.skills.filter((s) => s.level === 3).length
)

onMounted(() => {
  if (!sectionRef.value) return

  const pills = pillRefs.value.filter((el) => el != null) as HTMLElement[]
  if (pills.length === 0) return

  gsap.fromTo(
    pills,
    { scale: 0.7, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      stagger: 0.03,
      ease: 'back.out(1.4)',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 80%',
        once: true,
      },
    }
  )
})

onBeforeUnmount(() => {
  ScrollTrigger.getAll().forEach((t) => t.kill())
})
</script>

<template>
  <section
    ref="sectionRef"
    class="mx-auto w-full max-w-6xl px-6 py-16 md:py-20"
  >
    <!-- 标题 + 徽章 -->
    <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div class="flex items-center gap-3">
        <span
          class="flex h-10 w-10 items-center justify-center rounded-xl2 bg-accent/12 text-accent"
        >
          <Sparkles class="h-5 w-5" :stroke-width="2" />
        </span>
        <div>
          <h2 class="text-2xl md:text-3xl font-bold tracking-tight text-primary">
            技能栈
          </h2>
          <p class="mt-1 text-sm text-tertiary">
            日常工作与学习中常用的工具与框架
          </p>
        </div>
      </div>
      <div
        class="flex items-center gap-2 rounded-fullButton border border-default bg-surface-secondary px-4 py-1.5 text-sm"
      >
        <span class="text-secondary">共</span>
        <span class="font-semibold text-primary">{{ totalSkills }}</span>
        <span class="text-secondary">项技能 · 精通</span>
        <span class="font-semibold text-accent">{{ masterCount }}</span>
        <span class="text-secondary">项</span>
      </div>
    </div>

    <!-- 技能内容：按分类分组平铺 -->
    <div ref="gridRef" class="flex flex-col gap-8">
      <div
        v-for="group in groupedSkills"
        :key="group.category"
        class="flex flex-col gap-3"
      >
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-semibold uppercase tracking-wider text-tertiary">
            {{ group.label }}
          </h3>
          <span class="h-px flex-1 bg-border/60" />
          <span class="text-xs text-tertiary">
            {{ group.items.length }} 项
          </span>
        </div>
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
        >
          <div
            v-for="(skill, idx) in group.items"
            :key="skill.name"
            :ref="
              (el) => {
                const globalIdx =
                  profile.skills.findIndex((s) => s.name === skill.name)
                pillRefs[globalIdx] = el as HTMLElement | null
                // 消除未使用 idx 警告
                void idx
              }
            "
            class="rounded-fullButton px-4 py-2.5 text-sm font-medium text-center transition-all duration-300 border backdrop-blur-sm hover:-translate-y-1 hover:shadow-cardHover cursor-default"
            :class="[
              `skill-${skill.category}`,
              skill.level === 3 ? 'ring-1 ring-offset-0' : '',
            ]"
            :title="
              skill.level === 3
                ? '精通'
                : skill.level === 2
                ? '熟练'
                : skill.level === 1
                ? '了解'
                : ''
            "
          >
            <span class="inline-flex items-center gap-1.5">
              {{ skill.name }}
              <template v-if="skill.level === 3">
                <span class="text-[10px] opacity-80">★★★</span>
              </template>
              <template v-else-if="skill.level === 2">
                <span class="text-[10px] opacity-60">★★</span>
              </template>
              <template v-else-if="skill.level === 1">
                <span class="text-[10px] opacity-40">★</span>
              </template>
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
