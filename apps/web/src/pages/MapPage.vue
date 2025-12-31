<template>
  <div class="min-h-screen parchment-bg">
    <TopNav />
    
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-ink fantasy mb-4">{{ $t('menu.mapa') }}</h1>
        <p class="text-leather-dark">Mapa del mundo de Daggerheart</p>
      </div>
      
      <div class="scroll-border p-6 min-h-96">
        <div class="text-center text-leather-dark">
          <div class="text-8xl mb-4">🗺️</div>
          <p class="text-lg">El mapa aparecerá aquí</p>
          <p class="text-sm mt-2">Podrás ver ubicaciones, rutas y puntos de interés</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TopNav from '@/components/TopNav.vue'
</script>