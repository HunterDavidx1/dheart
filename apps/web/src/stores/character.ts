import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Character } from '@shared/character'

export const useCharacterStore = defineStore('character', () => {
  const characters = ref<Character[]>([])
  const selectedCharacter = ref<Character | null>(null)

  const addCharacter = (character: Character) => {
    characters.value.push(character)
  }

  const updateCharacter = (characterId: string, updates: Partial<Character>) => {
    const index = characters.value.findIndex(c => c.id === characterId)
    if (index !== -1) {
      characters.value[index] = { ...characters.value[index], ...updates }
    }
  }

  const selectCharacter = (character: Character | null) => {
    selectedCharacter.value = character
  }

  const removeCharacter = (characterId: string) => {
    characters.value = characters.value.filter(c => c.id !== characterId)
    if (selectedCharacter.value?.id === characterId) {
      selectedCharacter.value = null
    }
  }

  return {
    characters,
    selectedCharacter,
    addCharacter,
    updateCharacter,
    selectCharacter,
    removeCharacter
  }
})
