<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRoomStore } from '@/stores/room'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const roomStore = useRoomStore()
const { user, logout } = useAuth()

const roomName = ref('')
const playerName = ref('')
const roomPassword = ref('')
const isCreating = ref(true)

const handleLogout = () => {
  logout()
  router.push('/login')
}

const createRoom = () => {
  if (!roomName.value || !playerName.value) return
  
  const roomId = Math.random().toString(36).substr(2, 9)
  const player = {
    id: Math.random().toString(36).substr(2, 9),
    name: playerName.value,
    isGM: true
  }
  
  roomStore.setPlayer(player)
  router.push(`/room/${roomId}`)
}

const joinRoom = () => {
  if (!roomName.value || !playerName.value || !roomPassword.value) return
  
  const player = {
    id: Math.random().toString(36).substr(2, 9),
    name: playerName.value,
    isGM: false
  }
  
  roomStore.setPlayer(player)
  router.push(`/room/${roomName.value}`)
}
</script>

<template>
  <div class="min-h-screen parchment-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center relative">
        <h2 class="text-4xl font-bold text-ink fantasy mb-2">{{ $t('app.title') }}</h2>
        <p class="text-leather-dark">{{ isCreating ? $t('home.createRoom') : $t('home.joinRoom') }}</p>
        
        <div v-if="user" class="absolute top-0 right-0">
             <button class="text-xs medieval-button" @click="handleLogout">Logout</button>
        </div>
      </div>
      
      <div class="scroll-border p-8">
        <div class="space-y-6">
          <div v-if="user" class="text-center mb-4">
             <p class="text-ink">Welcome, {{ user.email }}</p>
          </div>

          <div>
            <label for="playerName" class="block text-sm font-medium text-ink mb-2">
              {{ $t('home.playerName') }}
            </label>
            <input
              id="playerName"
              v-model="playerName"
              type="text"
              class="medieval-input w-full"
              :placeholder="$t('home.playerName')"
            >
          </div>
          
          <div>
            <label for="roomName" class="block text-sm font-medium text-ink mb-2">
              {{ $t('home.roomName') }}
            </label>
            <input
              id="roomName"
              v-model="roomName"
              type="text"
              class="medieval-input w-full"
              :placeholder="$t('home.roomName')"
            >
          </div>
          
          <div v-if="!isCreating">
            <label for="password" class="block text-sm font-medium text-ink mb-2">
              {{ $t('home.password') }}
            </label>
            <input
              id="password"
              v-model="roomPassword"
              type="password"
              class="medieval-input w-full"
              :placeholder="$t('home.password')"
            >
          </div>
          
          <div class="flex space-x-4">
            <button
              @click="isCreating = true"
              class="flex-1 medieval-button"
              :class="{ 'opacity-50': !isCreating }"
            >
              {{ $t('home.mode.create') }}
            </button>
            <button
              @click="isCreating = false"
              class="flex-1 medieval-button"
              :class="{ 'opacity-50': isCreating }"
            >
              {{ $t('home.mode.join') }}
            </button>
          </div>
          
          <button
            @click="isCreating ? createRoom() : joinRoom()"
            class="w-full medieval-button"
            :disabled="!playerName || !roomName || (!isCreating && !roomPassword)"
          >
            {{ isCreating ? $t('home.createRoom') : $t('home.joinRoom') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
