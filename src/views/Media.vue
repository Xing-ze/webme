<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MediaTabs from '@/components/media/MediaTabs.vue'
import BangumiWall from '@/components/media/BangumiWall.vue'
import NeteaseDashboard from '@/components/media/NeteaseDashboard.vue'
import { useMediaStore } from '@/stores/media'

const store = useMediaStore()

const activeTab = ref<'bangumi' | 'netease'>('bangumi')

onMounted(() => {
  store.ensureLoaded()
})
</script>

<template>
  <div class="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
    <MediaTabs v-model:active="activeTab" />

    <!-- Skeleton loading -->
    <Transition name="fade-slide" mode="out-in">
      <div
        v-if="store.loading && store.data === null"
        key="skeleton"
        class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
      >
        <div
          v-for="i in 10"
          :key="i"
          class="glass-card p-3 animate-pulse"
        >
          <div class="aspect-[3/4] w-full rounded-xl2 bg-surface-tertiary" />
          <div class="mt-3 space-y-2">
            <div class="h-4 w-4/5 rounded bg-surface-tertiary" />
            <div class="h-3 w-2/5 rounded bg-surface-tertiary" />
            <div class="h-3 w-1/2 rounded bg-surface-tertiary" />
          </div>
        </div>
      </div>

      <!-- Content -->
      <Transition name="fade-slide" mode="out-in" appear>
        <BangumiWall
          v-if="activeTab === 'bangumi' && store.data"
          key="bangumi-wall"
        />
        <NeteaseDashboard
          v-else-if="activeTab === 'netease' && store.data"
          key="netease-dashboard"
        />
      </Transition>
    </Transition>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 220ms ease, transform 220ms ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
