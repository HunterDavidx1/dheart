import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import RoomPage from '@/pages/RoomPage.vue'
import DicePage from '@/pages/DicePage.vue'
import MapPage from '@/pages/MapPage.vue'
import LogsPage from '@/pages/LogsPage.vue'
import AboutPage from '@/pages/AboutPage.vue'
import LibraryPage from '@/pages/LibraryPage.vue'
import CharacterCreatorPage from '@/pages/CharacterCreatorPage.vue'
import { useAuth } from '@/composables/useAuth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
  },
  {
    path: '/library',
    name: 'library',
    component: LibraryPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/creator/character',
    name: 'characterCreator',
    component: CharacterCreatorPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/room/:roomId',
    name: 'room',
    component: RoomPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/dice',
    name: 'dice',
    component: DicePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/map',
    name: 'map',
    component: MapPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutPage,
  },
]

// Crear路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const { token } = useAuth()
  
  if (to.meta.requiresAuth && !token.value) {
    next({ name: 'login' })
  } else if (to.name === 'login' && token.value) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
