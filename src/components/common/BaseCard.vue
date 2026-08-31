<script setup lang="ts">
import { ref, computed, onMounted, type Component } from 'vue'
import { gsap } from 'gsap'

type ClassValue = string | number | null | boolean | undefined
type ClassType = ClassValue | ClassValue[] | Record<string, boolean | null | undefined>

interface Props {
  as?: string | Component
  glass?: boolean
  hoverable?: boolean
  ripple?: boolean
  tilt?: boolean
  class?: ClassType
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  glass: true,
  hoverable: true,
  ripple: false,
  tilt: false,
})

const cardRef = ref<HTMLElement | null>(null)
const isTouch = ref(false)

onMounted(() => {
  isTouch.value = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
})

function onCardDown(e: MouseEvent) {
  if (!props.ripple || e.button !== 0) return

  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = e.clientX - rect.left - size / 2
  const y = e.clientY - rect.top - size / 2

  const ripple = document.createElement('span')
  ripple.className = 'card-ripple'
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    border-radius: 9999px;
    background: rgb(var(--color-accent) / 0.4);
    pointer-events: none;
    opacity: 0.4;
  `
  target.appendChild(ripple)

  gsap.fromTo(
    ripple,
    { scale: 0, opacity: 0.4 },
    {
      scale: 2.5,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
      onComplete: () => {
        ripple.remove()
      },
    }
  )
}

function onCardMove(e: MouseEvent) {
  if (!props.tilt || isTouch.value) return

  const el = cardRef.value ?? (e.currentTarget as HTMLElement)
  const rect = el.getBoundingClientRect()
  const relX = (e.clientX - rect.left) / rect.width // 0~1
  const relY = (e.clientY - rect.top) / rect.height // 0~1
  const offsetX = relX * 2 - 1 // -1~+1
  const offsetY = relY * 2 - 1 // -1~+1

  const rotateY = offsetX * 3
  const rotateX = -offsetY * 2
  const translateY = props.hoverable ? -2.5 : -0.5

  gsap.to(el, {
    rotateX,
    rotateY,
    y: translateY,
    transformPerspective: 1000,
    duration: 0.18,
    ease: 'power2.out',
  })
}

function onCardLeave(e: MouseEvent) {
  if (!props.tilt || isTouch.value) return

  const el = cardRef.value ?? (e.currentTarget as HTMLElement)
  const leaveY = props.hoverable ? -2 : 0

  gsap.to(el, {
    rotateX: 0,
    rotateY: 0,
    y: leaveY,
    transformPerspective: 1000,
    duration: 0.25,
    ease: 'power2.out',
  })
}

// 将事件封装为仅在 prop 开启时绑定
const cardEvents = computed(() => {
  const evs: Record<string, (e: any) => void> = {}
  if (props.ripple) evs['onMousedown'] = onCardDown
  if (props.tilt) {
    evs['onMousemove'] = onCardMove
    evs['onMouseleave'] = onCardLeave
  }
  return evs
})
</script>

<template>
  <component
    :is="props.as"
    ref="cardRef"
    :class="[
      props.glass ? 'glass-card' : '',
      'p-6 transition-all duration-300 relative overflow-hidden',
      props.hoverable ? 'hover:-translate-y-0.5 hover:shadow-cardHover' : '',
      props.class ?? '',
    ]"
    v-bind="cardEvents"
  >
    <slot />
  </component>
</template>
