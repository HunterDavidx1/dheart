<template>
  <div class="scroll-border p-6">
    <h3 class="text-xl font-bold text-ink mb-4 fantasy">{{ title }}</h3>
    <div><slot /></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>
