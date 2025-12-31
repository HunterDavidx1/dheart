<template>
  <div class="scroll-border p-4 hover:shadow-medieval transition-all duration-200 cursor-pointer" @click="$emit('select', set)" role="button" :aria-label="`Seleccionar set ${set.name}`">
    <div class="flex items-center justify-between mb-2">
      <h4 class="font-bold text-ink">{{ set.name }}</h4>
      <span class="text-xs text-leather-dark bg-parchment-dark px-2 py-1 rounded-medieval">
        {{ set.dice.length }} dados
      </span>
    </div>
    <div class="flex flex-wrap gap-2 items-center">
      <DieShape
        v-for="(d, i) in set.dice"
        :key="i"
        :sides="d.sides"
        :size="34"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import DieShape from '@/components/DieShape.vue'

interface DiceSet {
  id: string
  name: string
  dice: { sides: number }[]
}

defineProps<{ set: DiceSet }>()
defineEmits<{ (e: 'select', set: DiceSet): void }>()
</script>
