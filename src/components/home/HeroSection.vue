<script setup lang="ts">
import { onMounted, ref, type Component } from 'vue'
import { gsap } from 'gsap'
import profile from '@/data/profile'
import {
  Github,
  Mail,
  Tv,
  Music,
  Globe,
} from 'lucide-vue-next'

// lucide icon 组件名称映射
const iconMap: Record<string, Component> = {
  Github,
  Mail,
  Tv,
  Music,
  Globe,
}

const avatarError = ref(false)
const avatarRef = ref<HTMLElement | null>(null)
const nameRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const headlineRef = ref<HTMLElement | null>(null)
const socialRefs = ref<Array<HTMLElement | null>>([])

onMounted(() => {
  const tl = gsap.timeline()

  // 头像先入场
  if (avatarRef.value) {
    tl.fromTo(
      avatarRef.value,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    )
  }
  // 姓名
  if (nameRef.value) {
    tl.fromTo(
      nameRef.value,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      '-=0.5'
    )
  }
  // 职位
  if (titleRef.value) {
    tl.fromTo(
      titleRef.value,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.5'
    )
  }
  // Headline
  if (headlineRef.value) {
    tl.fromTo(
      headlineRef.value,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.4'
    )
  }
  // Social icons stagger
  const validSocials = socialRefs.value.filter((el) => el != null)
  if (validSocials.length > 0) {
    tl.fromTo(
      validSocials,
      { opacity: 0, y: 20, scale: 0.85 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: 'back.out(1.6)',
      },
      '-=0.35'
    )
  }
})
</script>

<template>
  <section
    class="relative mx-auto flex w-full min-h-[75vh] max-w-6xl items-center overflow-hidden px-6 py-20"
  >
    <!-- 背景装饰光斑 -->
    <div
      class="pointer-events-none absolute -top-10 -left-16 h-80 w-80 rounded-full bg-accent/5 blur-3xl animate-float-slow"
    />
    <div
      class="pointer-events-none absolute top-40 right-0 h-96 w-96 rounded-full bg-accent/5 blur-3xl animate-float-slower"
    />
    <div
      class="pointer-events-none absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-accent/[0.04] blur-3xl animate-float-slow"
      style="animation-delay: -3s"
    />

    <div
      class="relative z-10 flex w-full flex-col items-center gap-10 md:flex-row md:items-center md:justify-center"
    >
      <!-- 头像区：双层光晕 + 头像 -->
      <div ref="avatarRef" class="relative shrink-0" style="opacity: 0">
        <!-- 外层光晕 -->
        <div
          class="absolute -inset-4 rounded-full bg-accent/20 blur-xl animate-halo-pulse-sub"
        />
        <!-- 中层光晕 -->
        <div
          class="absolute -inset-2 rounded-full bg-accent/30 blur-md animate-halo-pulse"
        />
        <!-- 头像本体 -->
        <div
          class="relative w-40 h-40 md:w-52 md:h-52 overflow-hidden rounded-full ring-4 ring-accent/30 shadow-glow"
        >
          <img
            v-if="!avatarError"
            :src="profile.avatarUrl"
            :alt="profile.name"
            class="h-full w-full object-cover"
            @error="avatarError = true"
          />
          <div
            v-else
            class="flex h-full w-full items-center justify-center bg-surface-secondary text-5xl"
          >
            🌱
          </div>
        </div>
      </div>

      <!-- 文字区 -->
      <div class="flex w-full max-w-xl flex-col items-center text-center md:items-start md:text-left">
        <h1
          ref="nameRef"
          class="text-4xl md:text-5xl font-bold tracking-tight text-primary"
          style="opacity: 0"
        >
          {{ profile.name }}
        </h1>
        <p
          ref="titleRef"
          class="mt-2 text-lg md:text-xl font-medium text-accent"
          style="opacity: 0"
        >
          {{ profile.title }}
        </p>
        <p
          ref="headlineRef"
          class="mt-4 text-base md:text-lg leading-relaxed text-secondary"
          style="opacity: 0"
        >
          {{ profile.headline }}
        </p>

        <!-- 社交图标行 -->
        <div
          class="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start"
        >
          <a
            v-for="(social, idx) in profile.socials"
            :key="social.name"
            :ref="(el) => { socialRefs[idx] = el as HTMLElement | null }"
            :href="social.href"
            :target="social.href.startsWith('http') ? '_blank' : undefined"
            :rel="social.href.startsWith('http') ? 'noopener noreferrer' : undefined"
            class="w-11 h-11 rounded-fullButton bg-surface-secondary border border-default flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:scale-110"
            :style="{ opacity: 0 }"
            :title="social.name"
            @mouseenter="(e) => { const t = e.currentTarget as HTMLElement; t.style.color = social.color ?? ''; t.style.borderColor = social.color ? social.color + '60' : ''; }"
            @mouseleave="(e) => { const t = e.currentTarget as HTMLElement; t.style.color = ''; t.style.borderColor = ''; }"
          >
            <component
              :is="iconMap[social.icon]"
              class="h-5 w-5"
              :stroke-width="social.icon === 'Github' ? 2 : 2"
            />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
