<template>
  <div class="space-y-3">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <label class="block text-ink text-sm mb-1">Nombre</label>
        <input class="w-full input-medieval" :value="modelValue.name || ''" @input="onInput('name', $event)" :readonly="readonly" />
      </div>
      <div>
        <label class="block text-ink text-sm mb-1">Tipo</label>
        <input class="w-full input-medieval" :value="modelValue.type || ''" @input="onInput('type', $event)" :readonly="readonly" />
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div>
        <label class="block text-ink text-sm mb-1">Nivel (Tier)</label>
        <input class="w-full input-medieval" :value="modelValue.tier || ''" @input="onInput('tier', $event)" :readonly="readonly" />
      </div>
      <div>
        <label class="block text-ink text-sm mb-1">Dificultad</label>
        <input class="w-full input-medieval" :value="modelValue.difficulty || ''" @input="onInput('difficulty', $event)" :readonly="readonly" />
      </div>
      <div>
        <label class="block text-ink text-sm mb-1">Umbrales</label>
        <input class="w-full input-medieval" :value="modelValue.thresholds || ''" @input="onInput('thresholds', $event)" :readonly="readonly" />
      </div>
    </div>
    <div>
      <label class="block text-ink text-sm mb-1">Descripción</label>
      <textarea class="w-full input-medieval" rows="3" :value="modelValue.description || ''" @input="onInput('description', $event)" :readonly="readonly"></textarea>
    </div>
    <div>
      <label class="block text-ink text-sm mb-1">Motivos y tácticas</label>
      <textarea class="w-full input-medieval" rows="2" :value="modelValue.motives_and_tactics || ''" @input="onInput('motives_and_tactics', $event)" :readonly="readonly"></textarea>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div>
        <label class="block text-ink text-sm mb-1">HP</label>
        <input class="w-full input-medieval" :value="modelValue.hp || ''" @input="onInput('hp', $event)" :readonly="readonly" />
      </div>
      <div>
        <label class="block text-ink text-sm mb-1">Estrés</label>
        <input class="w-full input-medieval" :value="modelValue.stress || ''" @input="onInput('stress', $event)" :readonly="readonly" />
      </div>
      <div>
        <label class="block text-ink text-sm mb-1">ATK</label>
        <input class="w-full input-medieval" :value="modelValue.atk || ''" @input="onInput('atk', $event)" :readonly="readonly" />
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div>
        <label class="block text-ink text-sm mb-1">Ataque</label>
        <input class="w-full input-medieval" :value="modelValue.attack || ''" @input="onInput('attack', $event)" :readonly="readonly" />
      </div>
      <div>
        <label class="block text-ink text-sm mb-1">Alcance</label>
        <input class="w-full input-medieval" :value="modelValue.range || ''" @input="onInput('range', $event)" :readonly="readonly" />
      </div>
      <div>
        <label class="block text-ink text-sm mb-1">Daño</label>
        <input class="w-full input-medieval" :value="modelValue.damage || ''" @input="onInput('damage', $event)" :readonly="readonly" />
      </div>
    </div>
    <div>
      <label class="block text-ink text-sm mb-1">Experiencia</label>
      <input class="w-full input-medieval" :value="modelValue.experience || ''" @input="onInput('experience', $event)" :readonly="readonly" />
    </div>
    <div>
      <label class="block text-ink text-sm mb-1">Hazañas</label>
      <div v-if="modelValue.feats && modelValue.feats.length > 0" class="space-y-2">
        <div v-for="(f, i) in modelValue.feats" :key="i" class="scroll-border p-3">
          <input class="w-full input-medieval mb-2" :value="f.name" @input="onFeatInput(i, 'name', $event)" :readonly="readonly" />
          <textarea class="w-full input-medieval" rows="2" :value="f.text" @input="onFeatInput(i, 'text', $event)" :readonly="readonly"></textarea>
        </div>
      </div>
      <div v-else class="text-leather-dark">Sin hazañas</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Adversary } from '@shared/data'
const props = defineProps<{
  modelValue: Adversary
  readonly?: boolean
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: Adversary): void
}>()

function onInput<K extends keyof Adversary>(key: K, e: Event) {
  const v = (e.target as HTMLInputElement).value
  emit('update:modelValue', { ...props.modelValue, [key]: v })
}

function onFeatInput(index: number, key: 'name'|'text', e: Event) {
  const v = (e.target as HTMLInputElement | HTMLTextAreaElement).value
  const feats = (props.modelValue.feats || []).map((f, i) => i === index ? { ...f, [key]: v } : f)
  emit('update:modelValue', { ...props.modelValue, feats })
}
</script>
