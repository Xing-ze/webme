<script setup lang="ts">
import { computed } from 'vue'
import { gsap } from 'gsap'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'secondary',
  size: 'md',
  disabled: false,
  fullWidth: false,
  type: 'button',
})

function onButtonDown(e: MouseEvent) {
  // 只对鼠标左键触发
  if (e.button !== 0) return

  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = e.clientX - rect.left - size / 2
  const y = e.clientY - rect.top - size / 2

  const ripple = document.createElement('span')
  ripple.className = 'ripple'
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    border-radius: 9999px;
    background: currentColor;
    pointer-events: none;
    opacity: 0.35;
  `
  target.appendChild(ripple)

  gsap.fromTo(
    ripple,
    { scale: 0, opacity: 0.35 },
    {
      scale: 2.5,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: () => {
        ripple.remove()
      },
    }
  )
}

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-1.5 text-sm'
    case 'lg':
      return 'px-6 py-3 text-lg'
    case 'md':
    default:
      return 'px-5 py-2.5 text-base'
  }
})

const variantClass = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-accent text-white hover:bg-accent-hover shadow-card'
    case 'ghost':
      return 'text-secondary hover:text-primary hover:bg-surface-tertiary'
    case 'secondary':
    default:
      return 'bg-surface-secondary text-primary border border-default hover:bg-surface-tertiary'
  }
})
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled"
    :class="[
      'relative overflow-hidden inline-flex items-center justify-center gap-2 font-medium rounded-fullButton transition-all duration-200 focus:outline-none focus:ring-2 ring-accent disabled:opacity-50 disabled:cursor-not-allowed active:scale-95',
      sizeClass,
      variantClass,
      props.fullWidth ? 'w-full' : '',
    ]"
    @mousedown="onButtonDown"
  >
    <slot />
  </button>
</template>
