import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Room {
  id: string
  name: string
  players: Player[]
  gm?: Player
  createdAt: string
}

export interface Player {
  id: string
  name: string
  isGM: boolean
}

export const useRoomStore = defineStore('room', () => {
  const currentRoom = ref<Room | null>(null)
  const currentPlayer = ref<Player | null>(null)
  const isConnected = ref(false)

  const setRoom = (room: Room) => {
    currentRoom.value = room
  }

  const setPlayer = (player: Player) => {
    currentPlayer.value = player
  }

  const setConnected = (connected: boolean) => {
    isConnected.value = connected
  }

  const addPlayer = (player: Player) => {
    if (currentRoom.value && !currentRoom.value.players.find(p => p.id === player.id)) {
      currentRoom.value.players.push(player)
    }
  }

  const removePlayer = (playerId: string) => {
    if (currentRoom.value) {
      currentRoom.value.players = currentRoom.value.players.filter(p => p.id !== playerId)
    }
  }

  return {
    currentRoom,
    currentPlayer,
    isConnected,
    setRoom,
    setPlayer,
    setConnected,
    addPlayer,
    removePlayer
  }
})