<script setup lang="ts">
import { ref } from 'vue'
import SplashScreen from '@/components/common/SplashScreen.vue'
import AppLayout from '@/layouts/AppLayout.vue'

const showSplash = ref(true)

function onSplashDone() {
  showSplash.value = false
}
</script>

<template>
  <SplashScreen v-if="showSplash" @done="onSplashDone" />
  <AppLayout v-else />
</template>
