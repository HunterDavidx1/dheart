<template>
  <div class="min-h-screen parchment-bg">
    <TopNav />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Panel de personajes (izquierda) -->
        <div class="lg:col-span-1 space-y-4">
          <h3 class="text-xl font-bold text-ink fantasy">{{ $t('room.characters') }}</h3>
          <div class="space-y-3">
            <CharacterCard 
              v-for="i in 6" 
              :key="i"
              :character="{ 
                id: `char-${i}`, 
                name: `Personaje ${i}`, 
                className: 'Guerrero',
                level: 1,
                hpCurrent: 10,
                hpMax: 10
              }"
            />
          </div>
        </div>

        <!-- Área central -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Banner de sesión -->
          <SessionBanner />
          
          <!-- Contenido principal -->
          <div class="scroll-border p-6 min-h-96">
            <div class="text-center text-leather-dark">
              <p class="text-lg">Área principal de juego</p>
              <p class="text-sm mt-2">Aquí aparecerán los dados, mapas y otros elementos</p>
            </div>
            <div class="mt-4">
              <button class="px-3 py-2 rounded-medieval bg-leather text-parchment" @click="attachOpen = true">
                Adjuntar desde Biblioteca
              </button>
            </div>
          </div>
        </div>

        <!-- Panel derecho -->
        <div class="lg:col-span-1 space-y-4">
          <GMPanel />
          <div class="scroll-border p-4">
            <h4 class="font-bold text-ink mb-2">{{ $t('room.enemies') }}</h4>
            <div class="text-sm text-leather-dark">
              <p>Los enemigos aparecerán aquí</p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="attachOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-parchment p-6 rounded-medieval w-full max-w-md">
          <h4 class="font-bold text-ink mb-4">Selecciona un personaje</h4>
          <ul class="space-y-2">
            <li v-for="c in library.characters" :key="c.id" class="flex justify-between items-center">
              <span class="text-ink">{{ c.name }}</span>
              <button class="px-2 py-1 rounded-medieval bg-leather text-parchment" @click="attachCharacter(c.id)">Adjuntar</button>
            </li>
          </ul>
          <div class="mt-4 text-right">
            <button class="px-3 py-2 rounded-medieval bg-leather text-parchment" @click="attachOpen = false">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TopNav from '@/components/TopNav.vue'
import CharacterCard from '@/components/CharacterCard.vue'
import SessionBanner from '@/components/SessionBanner.vue'
import GMPanel from '@/components/GMPanel.vue'
import { ref } from 'vue'
import { useLibraryStore } from '@/stores/library'
import { useAuth } from '@/composables/useAuth'
import { useRoute } from 'vue-router'

const library = useLibraryStore()
const { token } = useAuth()
const route = useRoute()
const roomId = route.params.roomId as string
const attachOpen = ref(false)

const attachCharacter = async (id: string) => {
  const character = library.characters.find(c => c.id === id)
  if (!character || !token.value) return
  await fetch(`http://localhost:3001/api/rooms/${roomId}/assets/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token.value}` },
    body: JSON.stringify({ assetType: 'characters', asset: character })
  })
  attachOpen.value = false
}
</script>
