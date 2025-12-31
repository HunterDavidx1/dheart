import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import RoomPage from '@/pages/RoomPage.vue'
import DicePage from '@/pages/DicePage.vue'
import MapPage from '@/pages/MapPage.vue'
import LogsPage from '@/pages/LogsPage.vue'
import AboutPage from '@/pages/AboutPage.vue'
import LibraryPage from '@/pages/LibraryPage.vue'
import CharacterCreatorPage from '@/pages/CharacterCreatorPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/library',
    name: 'library',
    component: LibraryPage,
  },
  {
    path: '/creator/character',
    name: 'characterCreator',
    component: CharacterCreatorPage,
  },
  {
    path: '/room/:roomId',
    name: 'room',
    component: RoomPage,
  },
  {
    path: '/dice',
    name: 'dice',
    component: DicePage,
  },
  {
    path: '/map',
    name: 'map',
    component: MapPage,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutPage,
  },
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
