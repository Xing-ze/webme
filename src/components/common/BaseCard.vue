<script setup lang="ts">
import type { Component } from 'vue'

type ClassValue = string | number | null | boolean | undefined
type ClassType = ClassValue | ClassValue[] | Record<string, boolean | null | undefined>

interface Props {
  as?: string | Component
  glass?: boolean
  hoverable?: boolean
  class?: ClassType
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  glass: true,
  hoverable: true,
})
</script>

<template>
  <component
    :is="props.as"
    :class="[
      props.glass ? 'glass-card' : '',
      'p-6 transition-all duration-300',
      props.hoverable ? 'hover:-translate-y-0.5 hover:shadow-cardHover' : '',
      props.class ?? '',
    ]"
  >
    <slot />
  </component>
</template>
