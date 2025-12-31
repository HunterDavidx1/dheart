<template>
  <div class="min-h-screen parchment-bg">
    <TopNav />
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 class="text-2xl font-bold text-ink fantasy mb-6">{{ $t('library.title') }}</h2>
      
      <div class="mb-4 flex space-x-2">
        <button
          class="px-3 py-2 rounded-medieval bg-leather text-parchment"
          :class="{ 'bg-leather-dark': activeTab === 'characters' }"
          @click="activeTab = 'characters'"
        >
          {{ $t('library.tab.characters') }}
        </button>
        <button
          class="px-3 py-2 rounded-medieval bg-leather text-parchment"
          :class="{ 'bg-leather-dark': activeTab === 'enemies' }"
          @click="activeTab = 'enemies'"
        >
          {{ $t('library.tab.enemies') }}
        </button>
        <button
          class="px-3 py-2 rounded-medieval bg-leather text-parchment"
          :class="{ 'bg-leather-dark': activeTab === 'dice' }"
          @click="activeTab = 'dice'"
        >
          {{ $t('library.tab.dice') }}
        </button>
        <button
          class="px-3 py-2 rounded-medieval bg-leather text-parchment"
          :class="{ 'bg-leather-dark': activeTab === 'maps' }"
          @click="activeTab = 'maps'"
        >
          {{ $t('library.tab.maps') }}
        </button>
      </div>
      <div class="mb-6 flex space-x-2">
        <button class="px-3 py-2 rounded-medieval bg-leather text-parchment" @click="exportLibrary">
          {{ $t('library.actions.export') }}
        </button>
        <label class="px-3 py-2 rounded-medieval bg-leather text-parchment cursor-pointer">
          <input type="file" class="hidden" accept="application/json" @change="importLibrary" />
          {{ $t('library.actions.import') }}
        </label>
      </div>

      <div v-if="activeTab === 'characters'" class="space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-bold text-ink">{{ $t('library.section.characters') }}</h3>
          <button class="px-3 py-2 rounded-medieval bg-leather text-parchment" @click="openCreate('character')">
            {{ $t('library.actions.create') }}
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CharacterCard v-for="c in library.characters" :key="c.id" :character="c" />
        </div>
      </div>

      <div v-else-if="activeTab === 'enemies'" class="space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-bold text-ink">{{ $t('library.section.enemies') }}</h3>
          <button class="px-3 py-2 rounded-medieval bg-leather text-parchment" @click="startCreateEnemy">
            {{ $t('library.actions.create') }}
          </button>
        </div>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="scroll-border p-4">
              <label class="block text-ink text-sm mb-1">Selecciona un enemigo</label>
              <select class="w-full input-medieval" v-model="selectedEnemyName" @change="onSelectEnemy">
                <option value="">-- Seleccionar --</option>
                <option v-for="a in adversariesList" :key="a.name" :value="a.name">{{ a.name }}</option>
              </select>
              <div class="mt-3 text-leather-dark text-sm">
                O usa el botón Crear para un formulario vacío.
              </div>
              <div class="mt-4">
                <h4 class="text-lg font-bold text-ink mb-2">Tus enemigos guardados</h4>
                <div v-if="library.enemies.length === 0" class="text-leather-dark">No tienes enemigos guardados.</div>
                <ul v-else class="space-y-2">
                  <li v-for="e in library.enemies" :key="e.id" class="flex justify-between items-center">
                    <span class="text-ink">{{ e.name }}</span>
                    <button class="px-2 py-1 rounded-medieval bg-leather text-parchment text-sm" @click="loadSavedEnemy(e.id)">Ver</button>
                  </li>
                </ul>
              </div>
            </div>
            <div class="scroll-border p-4">
              <h4 class="text-lg font-bold text-ink mb-2">Ficha de enemigo</h4>
              <EnemyForm v-if="editableEnemy" v-model="editableEnemy" :readonly="enemyReadonly" />
              <div v-else class="text-leather-dark">Selecciona un enemigo o crea uno nuevo.</div>
              <div v-if="editableEnemy && !enemyReadonly" class="mt-4 flex justify-end space-x-2">
                <button class="px-3 py-2 rounded-medieval bg-leather text-parchment" @click="cancelCreateEnemy">Cancelar</button>
                <button class="px-3 py-2 rounded-medieval bg-leather-dark text-parchment" @click="saveCreatedEnemy">Guardar en biblioteca</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'dice'" class="space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-bold text-ink">{{ $t('library.section.dice') }}</h3>
          <button class="px-3 py-2 rounded-medieval bg-leather text-parchment" @click="openCreate('dice')">
            {{ $t('library.actions.create') }}
          </button>
        </div>
        <div v-if="library.diceSets.length === 0" class="scroll-border p-6">
          <p class="text-leather-dark">{{ $t('library.empty.dice') }}</p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DiceSetCard v-for="s in library.diceSets" :key="s.id" :set="s" @select="onSelectSet" />
        </div>
        <DicePreview class="mt-4" :selected-set="selectedSet" />
      </div>

      <div v-else-if="activeTab === 'maps'" class="space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-bold text-ink">{{ $t('library.section.maps') }}</h3>
          <button class="px-3 py-2 rounded-medieval bg-leather text-parchment" @click="openCreate('map')">
            {{ $t('library.actions.create') }}
          </button>
        </div>
        <div class="scroll-border p-6">
          <p class="text-leather-dark">{{ $t('library.empty.maps') }}</p>
        </div>
      </div>

      <div v-if="createModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-parchment p-6 rounded-medieval w-full max-w-md">
          <h4 class="text-lg font-bold text-ink mb-4">{{ $t('library.creator.title') }}</h4>
          <form @submit.prevent="submitCreate">
            <div v-if="createType === 'character'" class="space-y-3">
              <input v-model="form.name" class="w-full input-medieval" :placeholder="$t('library.form.name')" />
              <input v-model="form.className" class="w-full input-medieval" :placeholder="$t('library.form.class')" />
              <input v-model.number="form.level" type="number" min="1" class="w-full input-medieval" :placeholder="$t('library.form.level')" />
              <div class="flex space-x-2">
                <input v-model.number="form.hpMax" type="number" min="1" class="w-1/2 input-medieval" :placeholder="$t('library.form.hpMax')" />
                <input v-model.number="form.hpCurrent" type="number" min="0" class="w-1/2 input-medieval" :placeholder="$t('library.form.hpCurrent')" />
              </div>
              <select v-model="form.locale" class="w-full input-medieval">
                <option value="es">ES</option>
                <option value="en">EN</option>
              </select>
            </div>
            <div v-else-if="createType === 'enemy'" class="space-y-3">
              <input v-model="form.name" class="w-full input-medieval" :placeholder="$t('library.form.name')" />
            </div>
            <div v-else-if="createType === 'dice'" class="space-y-3">
              <input v-model="form.name" class="w-full input-medieval" :placeholder="$t('library.form.name')" />
            </div>
            <div v-else class="space-y-3">
              <input v-model="form.name" class="w-full input-medieval" :placeholder="$t('library.form.name')" />
              <input v-model="form.imageUrl" class="w-full input-medieval" :placeholder="$t('library.form.imageUrl')" />
            </div>
            <div class="mt-4 flex justify-end space-x-2">
              <button type="button" class="px-3 py-2 rounded-medieval bg-leather text-parchment" @click="closeCreate">
                {{ $t('library.actions.cancel') }}
              </button>
              <button type="submit" class="px-3 py-2 rounded-medieval bg-leather-dark text-parchment">
                {{ $t('library.actions.save') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import TopNav from '@/components/TopNav.vue'
import CharacterCard from '@/components/CharacterCard.vue'
import DiceSetCard from '@/components/DiceSetCard.vue'
import DicePreview from '@/components/DicePreview.vue'
import EnemyForm from '@/components/EnemyForm.vue'
import { useLibraryStore } from '@/stores/library'
import { validateCharacter } from '@/lib/validateCharacter'
import { useRoute, useRouter } from 'vue-router'
import { adversaries as adversariesList, type Adversary } from '@shared/data'
const activeTab = ref<'characters'|'enemies'|'dice'|'maps'>('characters')
const createModal = ref(false)
const createType = ref<'character'|'enemy'|'dice'|'map'>('character')
const form = reactive({
  name: '',
  className: '',
  level: 1,
  hpMax: 10,
  hpCurrent: 10,
  locale: 'es',
  imageUrl: ''
})

const library = useLibraryStore()
const route = useRoute()
const validTabs = ['characters','enemies','dice','maps']
const initial = (route.query.tab as string) || 'characters'
if (validTabs.includes(initial)) {
  activeTab.value = initial as any
}
watch(() => route.query.tab, (t) => {
  if (typeof t === 'string' && validTabs.includes(t)) {
    activeTab.value = t as any
  }
})
 

const router = useRouter()
const selectedSet = ref<{ id: string; name: string; dice: { sides: number }[] } | null>(null)
const onSelectSet = (s: { id: string; name: string; dice: { sides: number }[] }) => {
  selectedSet.value = s
}
const openCreate = (type: 'character'|'enemy'|'dice'|'map') => {
  createType.value = type
  if (type === 'character') {
    router.push('/creator/character')
    return
  }
  form.name = ''
  form.className = ''
  form.level = 1
  form.hpMax = 10
  form.hpCurrent = 10
  form.locale = 'es'
  ;(form as any).imageUrl = ''
  createModal.value = true
}

const selectedEnemyName = ref<string>('')
const editableEnemy = ref<Adversary | null>(null)
const enemyReadonly = ref<boolean>(true)

function onSelectEnemy() {
  const found = adversariesList.find(a => a.name === selectedEnemyName.value)
  if (found) {
    editableEnemy.value = JSON.parse(JSON.stringify(found))
    enemyReadonly.value = true
  } else {
    editableEnemy.value = null
    enemyReadonly.value = true
  }
}

function startCreateEnemy() {
  editableEnemy.value = {
    name: '',
    type: '',
    tier: '',
    description: '',
    motives_and_tactics: '',
    difficulty: '',
    thresholds: '',
    hp: '',
    stress: '',
    atk: '',
    attack: '',
    range: '',
    damage: '',
    experience: '',
    feats: []
  }
  enemyReadonly.value = false
}

function cancelCreateEnemy() {
  editableEnemy.value = null
  enemyReadonly.value = true
}

function saveCreatedEnemy() {
  if (!editableEnemy.value) return
  const name = editableEnemy.value.name?.trim() || 'Enemigo'
  library.createEnemy({
    id: Math.random().toString(36).slice(2),
    name,
    ...editableEnemy.value,
    feats: editableEnemy.value.feats || []
  } as any)
  cancelCreateEnemy()
}

function loadSavedEnemy(id: string) {
  const e = library.enemies.find(x => x.id === id)
  if (!e) return
  editableEnemy.value = JSON.parse(JSON.stringify(e)) as any
  enemyReadonly.value = true
}

const closeCreate = () => {
  createModal.value = false
}

const submitCreate = () => {
  if (createType.value === 'character') {
    const data = {
      id: Math.random().toString(36).slice(2),
      name: form.name || 'Personaje',
      className: form.className || 'Guerrero',
      level: form.level || 1,
      evasion: 0,
      armorScore: 0,
      thresholds: { minor: 1, major: 2, severe: 3 },
      hpMax: form.hpMax || 10,
      hpCurrent: form.hpCurrent || 10,
      stress: 0,
      hope: 0,
      experience: 0,
      stats: { agility: 0, strength: 0, finesse: 0, instinct: 0, presence: 0, knowledge: 0, proficiency: 0 },
      classFeats: [],
      backgrounds: [],
      connections: [],
      inventory: [],
      inventoryWeapons: [],
      loadout: { abilityCards: [] },
      gold: { handfuls: 0, bags: 0, chest: 0 },
      locale: form.locale as 'es'|'en'
    }
    const res = validateCharacter(data as any)
    if (!res.valid) {
      alert(res.errors?.join('\n') || 'Invalid character')
      return
    }
    library.createCharacter(data as any)
  } else if (createType.value === 'map') {
    library.createMap({
      id: Math.random().toString(36).slice(2),
      title: form.name || 'Mapa',
      imageUrl: (form as any).imageUrl || undefined
    })
  }
  closeCreate()
}

const exportLibrary = () => {
  const data = library.exportJSON()
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'daggerheart_library.json'
  a.click()
  URL.revokeObjectURL(url)
}

const importLibrary = async (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files || !input.files[0]) return
  const text = await input.files[0].text()
  library.importJSON(text)
}

</script>
