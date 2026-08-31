<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BaseCard from '@/components/common/BaseCard.vue'
import { BriefcaseBusiness } from 'lucide-vue-next'
import profile from '@/data/profile'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement | null>(null)
const cardWrapRefs = ref<Array<HTMLElement | null>>([])
const dotRefs = ref<Array<HTMLElement | null>>([])

onMounted(() => {
  if (!sectionRef.value) return

  profile.timeline.forEach((item, i) => {
    const cardEl = cardWrapRefs.value[i]
    const dotEl = dotRefs.value[i]
    if (!cardEl) return

    const isLeft = item.side === 'left'

    // 卡片滑入（移动端只做淡入上移，md 及以上按左右方向）
    const media = window.matchMedia('(min-width: 768px)')
    const fromX = media.matches ? (isLeft ? -40 : 40) : 0
    const fromY = media.matches ? 0 : 20

    gsap.fromTo(
      cardEl,
      { opacity: 0, x: fromX, y: fromY },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardEl,
          start: 'top 85%',
          once: true,
        },
      }
    )

    // 中线上的圆点弹跳放大
    if (dotEl) {
      gsap.fromTo(
        dotEl,
        { scale: 0 },
        {
          scale: 1,
          duration: 0.5,
          ease: 'back.out(2)',
          scrollTrigger: {
            trigger: cardEl,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              // 弹入完成后，启动持续呼吸 pulse
              gsap.to(dotEl, {
                keyframes: [
                  { scale: 1.08, opacity: 0.85, duration: 0.9 },
                  { scale: 1, opacity: 1, duration: 0.9 },
                ],
                repeat: -1,
                yoyo: false,
                ease: 'sine.inOut',
                delay: 0.3,
              })
            },
          },
        }
      )
    }
  })
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
    <!-- 标题 -->
    <div class="mb-12 flex items-center gap-3">
      <span
        class="flex h-10 w-10 items-center justify-center rounded-xl2 bg-accent/12 text-accent"
      >
        <BriefcaseBusiness class="h-5 w-5" :stroke-width="2" />
      </span>
      <div>
        <h2 class="text-2xl md:text-3xl font-bold tracking-tight text-primary">
          经历时间线
        </h2>
        <p class="mt-1 text-sm text-tertiary">
          工作与教育经历，记录每一步成长
        </p>
      </div>
    </div>

    <!-- Timeline 容器 -->
    <div class="relative">
      <!-- 竖线：md 居中，移动端靠左 left-6 -->
      <div
        class="absolute left-6 top-0 bottom-0 w-px bg-border md:left-1/2 md:-translate-x-1/2"
      />

      <div class="flex flex-col gap-10 md:gap-14">
        <div
          v-for="(item, idx) in profile.timeline"
          :key="item.id"
          class="relative min-h-[60px]"
        >
          <!-- 中线上的圆点 -->
          <div
            :ref="(el) => { dotRefs[idx] = el as HTMLElement | null }"
            class="absolute left-6 top-5 -translate-x-1/2 w-4 h-4 rounded-fullButton bg-accent ring-4 ring-surface z-10 md:top-6 md:left-1/2"
          />

          <!-- 卡片容器
               - <md：ml-14（避开左竖线）全宽
               - >=md：宽约一半，left 用 mr-auto 靠到左半，right 用 ml-auto 靠到右半 -->
          <div
            :ref="(el) => { cardWrapRefs[idx] = el as HTMLElement | null }"
            class="md:w-[calc(50%-2rem)]"
            :class="[
              'ml-14 md:ml-0',
              item.side === 'left' ? 'md:mr-auto md:pr-0' : 'md:ml-auto md:pl-0',
            ]"
          >
            <BaseCard glass hoverable class="!p-5">
              <!-- 顶栏：tag 徽章 + 时间 -->
              <div class="mb-3 flex flex-wrap items-center gap-2">
                <span
                  v-if="item.tag"
                  class="inline-flex items-center rounded-fullButton px-2.5 py-0.5 text-[11px] font-medium text-white"
                  :class="item.tag === 'work' ? 'bg-accent' : 'bg-success'"
                >
                  {{ item.tag === 'work' ? '工作' : '教育' }}
                </span>
                <span
                  v-if="item.subtitle"
                  class="text-xs text-tertiary"
                >
                  {{ item.subtitle }}
                </span>
              </div>
              <!-- 标题 -->
              <h3 class="text-lg font-semibold text-primary leading-snug">
                {{ item.title }}
              </h3>
              <!-- 描述 -->
              <p class="mt-2 text-sm text-secondary leading-relaxed">
                {{ item.description }}
              </p>
            </BaseCard>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
