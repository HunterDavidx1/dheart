<template>
  <nav class="bg-leather shadow-medieval border-b-2 border-leather-dark">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <h1 class="text-2xl font-bold text-parchment fantasy">{{ $t('app.title') }}</h1>
        </div>
        
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <router-link 
              to="/library" 
              class="text-parchment hover:text-parchment-dark px-3 py-2 rounded-medieval text-sm font-medium transition-colors duration-200"
              :class="{ 'bg-leather-dark': $route.path === '/library' }"
            >
              {{ $t('menu.library') }}
            </router-link>
            <div class="relative">
              <button
                @click="creatorOpen = !creatorOpen"
                class="text-parchment hover:text-parchment-dark px-3 py-2 rounded-medieval text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <span>{{ $t('menu.creator') }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div v-if="creatorOpen" class="absolute mt-2 bg-leather-dark rounded-medieval shadow-medieval border border-leather-dark min-w-[180px] z-50">
                <button @click="goCreator('characters')" class="block w-full text-left text-parchment hover:text-parchment-dark px-4 py-2 text-sm">
                  {{ $t('menu.creator.characters') }}
                </button>
                <button @click="goCreator('enemies')" class="block w-full text-left text-parchment hover:text-parchment-dark px-4 py-2 text-sm">
                  {{ $t('menu.creator.enemies') }}
                </button>
                <button @click="goCreator('dice')" class="block w-full text-left text-parchment hover:text-parchment-dark px-4 py-2 text-sm">
                  {{ $t('menu.creator.dice') }}
                </button>
                <button @click="goCreator('maps')" class="block w-full text-left text-parchment hover:text-parchment-dark px-4 py-2 text-sm">
                  {{ $t('menu.creator.maps') }}
                </button>
                <button @click="goCreator('event')" class="block w-full text-left text-parchment hover:text-parchment-dark px-4 py-2 text-sm">
                  {{ $t('menu.creator.event') }}
                </button>
              </div>
            </div>
            <router-link 
              to="/about" 
              class="text-parchment hover:text-parchment-dark px-3 py-2 rounded-medieval text-sm font-medium transition-colors duration-200"
              :class="{ 'bg-leather-dark': $route.path === '/about' }"
            >
              {{ $t('menu.about') }}
            </router-link>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <LanguageSwitcher />
          <div v-if="user" class="flex items-center" title="Logged in">
            <svg class="w-5 h-5 text-parchment" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-4.418 0-8 2.239-8 5v2h16v-2c0-2.761-3.582-5-8-5z"/>
            </svg>
          </div>
          <button 
            @click="toggleMobileMenu"
            class="md:hidden text-parchment hover:text-parchment-dark p-2 rounded-medieval"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

        <div v-if="mobileMenuOpen" class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-leather-dark">
            <router-link 
              to="/library" 
              class="text-parchment hover:text-parchment-dark block px-3 py-2 rounded-medieval text-base font-medium"
              @click="mobileMenuOpen = false"
            >
              {{ $t('menu.library') }}
            </router-link>
            <div class="px-3">
              <button @click="mobileCreatorOpen = !mobileCreatorOpen" class="text-parchment hover:text-parchment-dark block w-full text-left py-2 rounded-medieval text-base font-medium">
                {{ $t('menu.creator') }}
              </button>
              <div v-if="mobileCreatorOpen" class="ml-2 space-y-1">
                <button @click="goCreator('characters'); mobileMenuOpen=false" class="block w-full text-left text-parchment hover:text-parchment-dark py-1">
                  {{ $t('menu.creator.characters') }}
                </button>
                <button @click="goCreator('enemies'); mobileMenuOpen=false" class="block w-full text-left text-parchment hover:text-parchment-dark py-1">
                  {{ $t('menu.creator.enemies') }}
                </button>
                <button @click="goCreator('dice'); mobileMenuOpen=false" class="block w-full text-left text-parchment hover:text-parchment-dark py-1">
                  {{ $t('menu.creator.dice') }}
                </button>
                <button @click="goCreator('maps'); mobileMenuOpen=false" class="block w-full text-left text-parchment hover:text-parchment-dark py-1">
                  {{ $t('menu.creator.maps') }}
                </button>
                <button @click="goCreator('event'); mobileMenuOpen=false" class="block w-full text-left text-parchment hover:text-parchment-dark py-1">
                  {{ $t('menu.creator.event') }}
                </button>
              </div>
            </div>
            <router-link 
              to="/about" 
              class="text-parchment hover:text-parchment-dark block px-3 py-2 rounded-medieval text-base font-medium"
              @click="mobileMenuOpen = false"
            >
              {{ $t('menu.about') }}
            </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const mobileMenuOpen = ref(false)
const mobileCreatorOpen = ref(false)
const creatorOpen = ref(false)
const router = useRouter()
const { user } = useAuth()

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function goCreator(tab: 'characters'|'enemies'|'dice'|'maps'|'event') {
  creatorOpen.value = false
  if (tab === 'characters') {
    router.push({ path: '/creator/character' })
    return
  }
  router.push({ path: '/library', query: { tab } })
}
</script>
