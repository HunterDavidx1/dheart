<template>
  <div class="min-h-screen parchment-bg">
    <TopNav />
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 class="text-2xl font-bold text-ink fantasy mb-6">{{ $t('menu.about') }}</h2>
      <div class="scroll-border p-6">
        <p class="text-ink">
          {{ $t('about.text') }}
        </p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import TopNav from '@/components/TopNav.vue'
</script>
