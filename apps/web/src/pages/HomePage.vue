<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useRoomStore } from '@/stores/room'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const roomStore = useRoomStore()
const { user, login, signup, logout } = useAuth()
const authForm = reactive({ email: '', password: '' })

const roomName = ref('')
const playerName = ref('')
const roomPassword = ref('')
const isCreating = ref(true)

const handleDevLogin = async () => {
  authForm.email = 'admin@daggerheart.com'
  authForm.password = 'admin123'
  try {
    await login(authForm.email, authForm.password)
  } catch (e) {
    console.error(e)
    alert(e)
  }
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
      <div class="text-center">
        <h2 class="text-4xl font-bold text-ink fantasy mb-2">{{ $t('app.title') }}</h2>
        <p class="text-leather-dark">{{ isCreating ? $t('home.createRoom') : $t('home.joinRoom') }}</p>
      </div>
      
      <div class="scroll-border p-4">
        <div v-if="user">
          <p class="text-ink">{{ user.email }}</p>
          <button class="mt-2 medieval-button" @click="logout">Logout</button>
        </div>
        <div v-else class="space-y-2">
          <input v-model="authForm.email" class="medieval-input w-full" placeholder="Email" />
          <input v-model="authForm.password" type="password" class="medieval-input w-full" placeholder="Password" />
          <div class="flex space-x-2">
            <button class="flex-1 medieval-button" @click="login(authForm.email, authForm.password)">Login</button>
            <button class="flex-1 medieval-button" @click="signup(authForm.email, authForm.password)">Signup</button>
          </div>
          <button class="w-full medieval-button bg-red-900/50 hover:bg-red-900/70 text-xs" @click="handleDevLogin">Dev Admin Login</button>
        </div>
      </div>
      
      <div class="scroll-border p-8">
        <div class="space-y-6">
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
