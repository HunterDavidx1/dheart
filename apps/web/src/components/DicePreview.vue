<template>
  <div class="scroll-border p-3">
    <h3 class="text-lg font-bold text-ink mb-3">Vista previa de tirada</h3>

    <div class="flex items-center justify-center gap-2 mb-3">
      <button
        class="px-2 py-1 text-xs rounded-medieval"
        :class="mode === 'classic' ? 'bg-leather-dark text-parchment' : 'bg-parchment-dark text-leather-dark'"
        aria-label="Modo Clásico"
        @click="setMode('classic')"
      >Clásico</button>
      <button
        class="px-2 py-1 text-xs rounded-medieval"
        :class="mode === 'daggerheart' ? 'bg-leather-dark text-parchment' : 'bg-parchment-dark text-leather-dark'"
        aria-label="Modo DaggerHeart"
        @click="setMode('daggerheart')"
      >DaggerHeart</button>
    </div>

    <div v-if="mode === 'classic'" class="flex flex-wrap items-center gap-2 mb-3 justify-center" role="group" aria-label="Selecciona dado único">
      <button
        v-for="s in palette"
        :key="s"
        class="p-1 rounded-medieval border border-parchment-dark"
        :aria-pressed="isSelected(s)"
        :aria-label="`Seleccionar d${s}`"
        @click="toggleDie(s)"
      >
        <DieShape :sides="s" :size="28" :color="colorFor(s)" />
      </button>
    </div>

    <div class="grid grid-cols-2 gap-3 mb-3">
      <div>
        <label class="block text-xs font-medium text-ink mb-1 text-center">Modificador</label>
        <div class="flex items-center justify-center flex-wrap gap-2">
          <button
            v-for="m in modifierOptions"
            :key="m"
            class="px-2 py-1 text-xs rounded-medieval"
            :class="m === modifier ? 'bg-leather-dark text-parchment' : 'bg-parchment-dark text-leather-dark'"
            :aria-pressed="m === modifier"
            :aria-label="`Modificador ${m}`"
            @click="modifier = m"
          >
            {{ m }}
          </button>
          <input
            v-model.number="modifier"
            type="number"
            step="1"
            class="input-medieval w-20 text-xs text-center rounded-medieval"
            aria-label="Modificador personalizado"
          />
        </div>
      </div>
      <div>
        <label class="block text-xs font-medium text-ink mb-1 text-center">Mínimo para Éxito</label>
        <div class="flex items-center justify-center flex-wrap gap-2">
          <button
            v-for="t in thresholdOptions"
            :key="t"
            class="px-2 py-1 text-xs rounded-medieval"
            :class="t === minSuccess ? 'bg-leather-dark text-parchment' : 'bg-parchment-dark text-leather-dark'"
            :aria-pressed="t === minSuccess"
            :aria-label="`Umbral ${t}`"
            @click="minSuccess = t"
          >
            {{ t }}
          </button>
          <input
            v-model.number="minSuccess"
            type="number"
            step="1"
            class="input-medieval w-24 text-xs text-center rounded-medieval"
            aria-label="Umbral personalizado"
          />
        </div>
      </div>
    </div>

    <button
      class="w-full medieval-button mb-2 text-sm"
      :aria-label="rollLabel"
      @click="roll()"
    >
      {{ rollLabel }}
    </button>

    <div v-if="mode === 'daggerheart'" class="flex items-center gap-4 mb-3 justify-center">
      <DieShape :sides="12" :label="hope || '—'" :size="40" color="#5f8b3f" />
      <DieShape :sides="12" :label="fear || '—'" :size="40" color="#d16a65" />
    </div>
    <div v-else class="flex items-center gap-4 mb-3 justify-center">
      <DieShape :sides="classicSides" :label="single || '—'" :size="40" color="#5f8b3f" />
    </div>
    <div class="text-center text-xs text-leather-dark mb-2">
      Total: <span class="text-ink font-bold">{{ total }}</span>
      <span class="ml-2 font-bold" :class="resultClass">{{ resultText }}</span>
    </div>

    <div class="bg-parchment-dark p-3 rounded-medieval text-leather-dark text-xs mb-3">
      <div>Esperanza: {{ hope }}</div>
      <div>Miedo: {{ fear }}</div>
      <div>Modificador: {{ modifier }}</div>
      <div>Mínimo para Éxito: {{ minSuccess }}</div>
    </div>

    <div class="scroll-border p-3">
      <h4 class="text-ink font-bold mb-2 text-sm">Historial de tiradas</h4>
      <div class="space-y-2 text-xs">
        <div v-for="h in history" :key="h.id" class="flex items-center gap-2">
          <span class="text-leather-dark">{{ h.ts }}</span>
          <span v-if="h.mode === 'hopeFear'" class="px-2 py-1 rounded-medieval" style="background-color:#5f8b3f;color:#fff">{{ h.results[0] }}</span>
          <span v-if="h.mode === 'hopeFear'" class="px-2 py-1 rounded-medieval" style="background-color:#d16a65;color:#fff">{{ h.results[1] }}</span>
          <span v-else class="px-2 py-1 rounded-medieval" style="background-color:#5f8b3f;color:#fff">{{ h.results[0] }}</span>
          <span class="text-ink">= {{ h.total }}</span>
          <span class="px-2 py-1 rounded-medieval" :class="h.success ? 'bg-parchment-dark text-leather' : 'bg-parchment-dark text-ink'">
            {{ labelFor(h) }}
          </span>
          <span class="ml-2 text-leather-dark">({{ h.sides.map(s => `d${s}`).join(' + ') }}, mod {{ h.modifier }})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import DieShape from '@/components/DieShape.vue'

const props = defineProps<{
  selectedSet?: { name: string; dice: { sides: number }[] } | null
}>()

const palette = [4, 6, 8, 10, 12, 20]
const selectedDice = ref<number[]>([])
const modifierOptions = [-1, 0, 1, 2, 3]
const thresholdOptions = [10, 13, 15]

const modifier = ref(0)
const minSuccess = ref(10)

const hope = ref(0)
const fear = ref(0)
const dualMode = ref(false)
const mode = ref<'classic'|'daggerheart'>('classic')

function isSelected(s: number) {
  return selectedDice.value.includes(s)
}

function toggleDie(s: number) {
  dualMode.value = false
  selectedDice.value = [s]
}

function colorFor(s: number) {
  if (!dualMode.value) {
    if (selectedDice.value.length === 0) return '#0b2340'
    return selectedDice.value[0] === s ? '#5f8b3f' : '#0b2340'
  }
  // dos seleccionados → colores esperanza/miedo asignados por orden
  if (12 === s) {
    // mostrar colores para d12 cuando dualMode
    return '#5f8b3f'
  }
  return '#0b2340'
}

const rollLabel = computed(() => {
  if (dualMode.value) return 'Tirar Esperanza y Miedo'
  if (selectedDice.value.length === 1) return `Tirar d${selectedDice.value[0]}`
  return 'Tirar Esperanza y Miedo'
})

function rand(max: number) {
  return Math.floor(Math.random() * max) + 1
}

type RollEntry = {
  id: string
  ts: string
  mode: 'single' | 'hopeFear'
  sides: number[]
  results: number[]
  modifier: number
  minSuccess: number
  total: number
  success: boolean
}

const history = ref<RollEntry[]>([])
const single = ref(0)
const classicSides = computed(() => selectedDice.value[0] || 6)

function roll() {
  let sides: number[] = []
  if (dualMode.value) {
    sides = [12, 12]
  } else if (selectedDice.value.length === 1) {
    sides = [selectedDice.value[0]]
  } else {
    sides = [12, 12]
    dualMode.value = true
  }
  const results = sides.map(s => rand(s))
  hope.value = results[0] || 0
  fear.value = results[1] || 0
  single.value = results[0] || 0
  const totalVal = results.reduce((a, b) => a + b, 0) + modifier.value
  const ok = totalVal >= minSuccess.value
  addHistory({
    id: Math.random().toString(36).slice(2),
    ts: new Date().toLocaleTimeString(),
    mode: sides.length === 2 ? 'hopeFear' : 'single',
    sides,
    results,
    modifier: modifier.value,
    minSuccess: minSuccess.value,
    total: totalVal,
    success: ok
  })
}

function addHistory(e: RollEntry) {
  history.value.unshift(e)
  if (history.value.length > 5) history.value.pop()
}

const total = computed(() => (hope.value + fear.value + modifier.value))
const success = computed(() => total.value >= minSuccess.value)

const resultClass = computed(() => {
  if (dualMode.value) {
    if (hope.value === fear.value && success.value) return 'text-leather'
    return success.value ? 'text-leather' : 'text-ink'
  }
  return success.value ? 'text-leather' : 'text-ink'
})

const resultText = computed(() => {
  if (dualMode.value) {
    const s = success.value
    if (hope.value === fear.value && s) return 'Éxito Crítico'
    if (s) {
      return hope.value > fear.value ? 'Éxito con Esperanza' : 'Éxito con Miedo'
    }
    if (hope.value > fear.value) return 'Fallo con Esperanza'
    if (fear.value > hope.value) return 'Fallo con Miedo'
    return 'Fallo'
  }
  return success.value ? 'Éxito' : 'Fallo'
})

function labelFor(h: RollEntry) {
  if (h.mode === 'hopeFear') {
    const s = h.success
    if (h.results[0] === h.results[1] && s) return 'ÉXITO CRÍTICO'
    if (s) return h.results[0] > h.results[1] ? 'ÉXITO CON ESPERANZA' : 'ÉXITO CON MIEDO'
    if (h.results[0] > h.results[1]) return 'FALLO CON ESPERANZA'
    if (h.results[1] > h.results[0]) return 'FALLO CON MIEDO'
    return 'FALLO'
  }
  return h.success ? 'ÉXITO' : 'FALLO'
}

// reaccionar al set seleccionado desde la biblioteca
watch(() => props.selectedSet, (s) => {
  if (!s) return
  const isDaggerHeart = s.name.toLowerCase().includes('daggerheart')
    || (s.dice.length === 2 && s.dice.every(d => d.sides === 12))
  if (isDaggerHeart) {
    dualMode.value = true
    selectedDice.value = [12, 12]
    mode.value = 'daggerheart'
  } else {
    dualMode.value = false
    selectedDice.value = [s.dice[0]?.sides ?? 6]
    mode.value = 'classic'
  }
})

function setMode(m: 'classic'|'daggerheart') {
  mode.value = m
  if (m === 'daggerheart') {
    dualMode.value = true
    selectedDice.value = [12, 12]
  } else {
    dualMode.value = false
    if (!selectedDice.value.length || selectedDice.value.length > 1) selectedDice.value = [6]
  }
}
</script>
