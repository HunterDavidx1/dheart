<template>
  <div class="min-h-screen parchment-bg">
    <TopNav />
    
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-ink fantasy mb-4">{{ $t('menu.dados') }}</h1>
        <p class="text-leather-dark">Lanza dados para tus acciones en Daggerheart</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="scroll-border p-6">
          <h3 class="text-xl font-bold text-ink mb-4">Lanzar Dados</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-ink mb-2">Tipo de dados</label>
              <select class="medieval-input w-full">
                <option>d6 - Agilidad</option>
                <option>d8 - Fuerza</option>
                <option>d10 - Instinto</option>
                <option>d12 - Conocimiento</option>
              </select>
            </div>
            <button class="w-full medieval-button">
              {{ $t('dice.roll') }}
            </button>
          </div>
        </div>
        
        <div class="scroll-border p-6">
          <h3 class="text-xl font-bold text-ink mb-4">Resultados</h3>
          <div class="text-center">
            <div class="text-6xl font-bold text-leather mb-4">🎲</div>
            <p class="text-lg text-leather-dark">{{ $t('dice.result') }}: <span class="font-bold text-ink">--</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TopNav from '@/components/TopNav.vue'
</script>