<template>
  <div class="scroll-border p-4 hover:shadow-medieval transition-all duration-200 cursor-pointer">
    <div class="flex items-center justify-between mb-2">
      <h4 class="font-bold text-ink">{{ character.name }}</h4>
      <span class="text-xs text-leather-dark bg-parchment-dark px-2 py-1 rounded-medieval">
        Nivel {{ character.level }}
      </span>
    </div>
    
    <div class="text-sm text-leather-dark mb-3">
      {{ character.className }}
    </div>
    
    <div class="flex items-center justify-between">
      <div class="text-xs text-leather-dark">
        <div>HP: {{ character.hpCurrent }}/{{ character.hpMax }}</div>
      </div>
      <div class="w-16 h-2 bg-parchment-dark rounded-medieval overflow-hidden">
        <div 
          class="h-full bg-leather transition-all duration-300"
          :style="{ width: `${(character.hpCurrent / character.hpMax) * 100}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Character {
  id: string
  name: string
  className: string
  level: number
  hpCurrent: number
  hpMax: number
}

interface Props {
  character: Character
}

defineProps<Props>()
</script>