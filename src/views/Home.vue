<script setup lang="ts">
import HeroSection from '@/components/home/HeroSection.vue'
import AboutSection from '@/components/home/AboutSection.vue'
import SkillsSection from '@/components/home/SkillsSection.vue'
import TimelineSection from '@/components/home/TimelineSection.vue'
import SiteFooter from '@/components/home/SiteFooter.vue'
</script>

<template>
  <div class="flex flex-col">
    <HeroSection />
    <AboutSection />
    <SkillsSection />
    <TimelineSection />
    <SiteFooter />
  </div>
</template>
