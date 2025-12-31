<template>
  <div class="scroll-border p-3 w-full inline-flex flex-col items-center min-h-[150px] justify-between">
    <span class="text-xs font-semibold text-parchment bg-leather px-2 py-1 rounded-medieval mb-2">{{ label }}</span>
    <div class="flex items-center justify-center gap-2">
      <button class="rounded-medieval bg-leather text-parchment w-6 h-6 flex items-center justify-center" @click="dec" title="Menos" aria-label="Menos">-</button>
      <div class="min-w-[2.5rem] text-center text-xl font-extrabold text-ink bg-parchment rounded-medieval border-2 border-leather-dark px-2 py-0.5 shadow-medieval">{{ modelValue }}</div>
      <button class="rounded-medieval bg-leather text-parchment w-6 h-6 flex items-center justify-center" @click="inc" title="Más" aria-label="Más">+</button>
    </div>
    <div v-if="options && options.length" class="mt-2 text-center">
      <span v-for="opt in options" :key="opt" class="block text-[11px] text-leather-dark">{{ opt }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: number
  label: string
  hint: string
  options?: string[]
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void
}>()
function inc() {
  emit('update:modelValue', props.modelValue + 1)
}
function dec() {
  emit('update:modelValue', Math.max(-3, props.modelValue - 1))
}
</script>
