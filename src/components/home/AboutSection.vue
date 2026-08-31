<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BaseCard from '@/components/common/BaseCard.vue'
import { User } from 'lucide-vue-next'
import profile from '@/data/profile'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement | null>(null)
const cardRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!sectionRef.value || !cardRef.value) return

  gsap.fromTo(
    cardRef.value,
    { opacity: 0, y: 24 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
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
    <BaseCard ref="cardRef" glass hoverable class="overflow-hidden">
      <div class="flex flex-col gap-4">
        <!-- 标题 -->
        <div class="flex items-center gap-3">
          <span
            class="flex h-10 w-10 items-center justify-center rounded-xl2 bg-accent/12 text-accent"
          >
            <User class="h-5 w-5" :stroke-width="2" />
          </span>
          <h2 class="text-2xl md:text-3xl font-bold tracking-tight text-primary">
            关于我
          </h2>
        </div>
        <!-- 内容：保留换行段落 -->
        <div
          class="text-base md:text-[17px] leading-8 text-secondary whitespace-pre-line"
        >
          {{ profile.about }}
        </div>
      </div>
    </BaseCard>
  </section>
</template>
