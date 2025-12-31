<template>
  <div class="min-h-screen parchment-bg">
    <TopNav />
    
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-ink fantasy mb-4">{{ $t('menu.logs') }}</h1>
        <p class="text-leather-dark">Registro de acciones y eventos del juego</p>
      </div>
      
      <div class="scroll-border p-6 min-h-96">
        <div class="space-y-4">
          <div class="border-l-4 border-leather pl-4 py-2">
            <div class="text-sm text-leather-dark">14:30</div>
            <div class="text-ink">Juan lanzó un dado de agilidad y obtuvo 5</div>
          </div>
          <div class="border-l-4 border-leather pl-4 py-2">
            <div class="text-sm text-leather-dark">14:28</div>
            <div class="text-ink">María creó un personaje Guerrero</div>
          </div>
          <div class="border-l-4 border-leather pl-4 py-2">
            <div class="text-sm text-leather-dark">14:25</div>
            <div class="text-ink">GM inició la sesión</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TopNav from '@/components/TopNav.vue'
</script>