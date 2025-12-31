import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Character } from '@shared/character'

const LS_KEY = 'daggerheart.library'

interface EnemyFeat {
  name: string
  text: string
}

interface Enemy {
  id: string
  name: string
  tier?: string
  type?: string
  description?: string
  motives_and_tactics?: string
  difficulty?: string
  thresholds?: string
  hp?: string
  stress?: string
  atk?: string
  attack?: string
  range?: string
  damage?: string
  experience?: string
  feats?: EnemyFeat[]
}

interface DiceSet {
  id: string
  name: string
  dice: { sides: number }[]
}

interface MapAsset {
  id: string
  title: string
  imageUrl?: string
}

interface LibraryState {
  characters: Character[]
  enemies: Enemy[]
  diceSets: DiceSet[]
  maps: MapAsset[]
}

function loadFromLocalStorage(): LibraryState {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return { characters: [], enemies: [], diceSets: [], maps: [] }
    const parsed = JSON.parse(raw)
    return {
      characters: parsed.characters || [],
      enemies: parsed.enemies || [],
      diceSets: parsed.diceSets || [],
      maps: parsed.maps || []
    }
  } catch {
    return { characters: [], enemies: [], diceSets: [], maps: [] }
  }
}

export const useLibraryStore = defineStore('library', () => {
  const characters = ref<Character[]>([])
  const enemies = ref<Enemy[]>([])
  const diceSets = ref<DiceSet[]>([])
  const maps = ref<MapAsset[]>([])

  const persist = () => {
    const state: LibraryState = {
      characters: characters.value,
      enemies: enemies.value,
      diceSets: diceSets.value,
      maps: maps.value
    }
    localStorage.setItem(LS_KEY, JSON.stringify(state))
  }

  const hydrate = () => {
    const s = loadFromLocalStorage()
    characters.value = s.characters
    enemies.value = s.enemies
    diceSets.value = s.diceSets
    maps.value = s.maps
    if (!diceSets.value || diceSets.value.length === 0) {
      diceSets.value = [
        { id: 'default-classic', name: 'Clásico RPG', dice: [{ sides: 4 }, { sides: 6 }, { sides: 8 }, { sides: 10 }, { sides: 12 }, { sides: 20 }] },
        { id: 'default-daggerheart', name: 'DaggerHeart', dice: [{ sides: 12 }, { sides: 12 }] },
        { id: 'default-d6', name: 'Simple D6', dice: [{ sides: 6 }] }
      ]
      persist()
    }
  }

  const createCharacter = (c: Character) => {
    characters.value.push(c)
    persist()
  }

  const updateCharacter = (id: string, u: Partial<Character>) => {
    const i = characters.value.findIndex(x => x.id === id)
    if (i !== -1) {
      characters.value[i] = { ...characters.value[i], ...u }
      persist()
    }
  }

  const createMap = (m: MapAsset) => {
    maps.value.push(m)
    persist()
  }

  const removeMap = (id: string) => {
    maps.value = maps.value.filter(x => x.id !== id)
    persist()
  }

  const removeCharacter = (id: string) => {
    characters.value = characters.value.filter(x => x.id !== id)
    persist()
  }

  const exportJSON = (): string => {
    const state: LibraryState = {
      characters: characters.value,
      enemies: enemies.value,
      diceSets: diceSets.value,
      maps: maps.value
    }
    return JSON.stringify(state, null, 2)
  }

  const importJSON = (raw: string) => {
    const parsed = JSON.parse(raw)
    characters.value = parsed.characters || []
    enemies.value = parsed.enemies || []
    diceSets.value = parsed.diceSets || []
    maps.value = parsed.maps || []
    persist()
  }

  const createEnemy = (e: Enemy) => {
    enemies.value.push(e)
    persist()
  }

  const updateEnemy = (id: string, u: Partial<Enemy>) => {
    const i = enemies.value.findIndex(x => x.id === id)
    if (i !== -1) {
      enemies.value[i] = { ...enemies.value[i], ...u }
      persist()
    }
  }

  const removeEnemy = (id: string) => {
    enemies.value = enemies.value.filter(x => x.id !== id)
    persist()
  }

  hydrate()

  return {
    characters,
    enemies,
    diceSets,
    maps,
    createCharacter,
    updateCharacter,
    removeCharacter,
    createMap,
    removeMap,
    exportJSON,
    importJSON,
    createEnemy,
    updateEnemy,
    removeEnemy
  }
})
