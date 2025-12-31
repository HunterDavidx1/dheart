<template>
  <div
    :style="shapeStyle"
    class="flex items-center justify-center"
  >
    <span class="text-parchment text-xs font-bold select-none">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  sides: number
  size?: number
  color?: string
  label?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  size: 40,
  color: '#0b2340',
  label: undefined
})

function polygonPoints(n: number): string {
  const pts: string[] = []
  const r = 50
  const cx = 50
  const cy = 50
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2
    const x = cx + r * Math.cos(angle)
    const y = cy + r * Math.sin(angle)
    pts.push(`${x}% ${y}%`)
  }
  return `polygon(${pts.join(',')})`
}

const clip = computed(() => {
  const n = Math.max(3, Math.floor(props.sides))
  return polygonPoints(n)
})

const shapeStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  backgroundColor: props.color,
  WebkitClipPath: clip.value,
  clipPath: clip.value,
  boxShadow: '0 2px 0 rgba(0,0,0,0.25)'
}))

const label = computed(() => props.label ?? props.sides)
</script>
