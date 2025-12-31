<template>
  <div class="relative">
    <button 
      @click="toggleDropdown"
      class="flex items-center space-x-1 text-parchment hover:text-parchment-dark p-2 rounded-medieval transition-colors duration-200"
    >
      <span class="text-sm font-medium">{{ currentLocale.toUpperCase() }}</span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-32 bg-leather-dark rounded-medieval shadow-medieval border border-leather z-10">
      <button
        @click="changeLocale('es')"
        class="block w-full text-left px-4 py-2 text-sm text-parchment hover:bg-leather transition-colors duration-200"
        :class="{ 'bg-leather': currentLocale === 'es' }"
      >
        Español
      </button>
      <button
        @click="changeLocale('en')"
        class="block w-full text-left px-4 py-2 text-sm text-parchment hover:bg-leather transition-colors duration-200"
        :class="{ 'bg-leather': currentLocale === 'en' }"
      >
        English
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const dropdownOpen = ref(false)

const currentLocale = computed(() => locale.value)

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const changeLocale = (newLocale: string) => {
  locale.value = newLocale
  dropdownOpen.value = false
}

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    dropdownOpen.value = false
  }
}

window.addEventListener('click', handleClickOutside)
</script>