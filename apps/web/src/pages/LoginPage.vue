<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login, signup } = useAuth()
const authForm = reactive({ email: '', password: '' })

const handleLogin = async () => {
  try {
    await login(authForm.email, authForm.password)
    router.push('/')
  } catch (e) {
    console.error(e)
    alert(e)
  }
}

const handleSignup = async () => {
  try {
    await signup(authForm.email, authForm.password)
    router.push('/')
  } catch (e) {
    console.error(e)
    alert(e)
  }
}

const handleDevLogin = async () => {
  authForm.email = 'admin@daggerheart.com'
  authForm.password = 'admin123'
  try {
    await login(authForm.email, authForm.password)
    router.push('/')
  } catch (e) {
    console.error(e)
    alert(e)
  }
}
</script>

<template>
  <div class="min-h-screen parchment-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="text-4xl font-bold text-ink fantasy mb-2">{{ $t('app.title') }}</h2>
        <p class="text-leather-dark">Please login or signup to continue</p>
      </div>
      
      <div class="scroll-border p-4">
        <div class="space-y-2">
          <input v-model="authForm.email" class="medieval-input w-full" placeholder="Email" />
          <input v-model="authForm.password" type="password" class="medieval-input w-full" placeholder="Password" />
          <div class="flex space-x-2">
            <button class="flex-1 medieval-button" @click="handleLogin">Login</button>
            <button class="flex-1 medieval-button" @click="handleSignup">Signup</button>
          </div>
          <button class="w-full medieval-button bg-red-900/50 hover:bg-red-900/70 text-xs" @click="handleDevLogin">Dev Admin Login</button>
        </div>
      </div>
    </div>
  </div>
</template>
