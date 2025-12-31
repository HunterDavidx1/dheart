import { ref } from 'vue'

const API_URL = 'http://localhost:3001'

const token = ref<string | null>(localStorage.getItem('auth.token'))
const user = ref<{ id: string; email: string } | null>(null)

async function fetchMe() {
  if (!token.value) {
    user.value = null
    return
  }
  const res = await fetch(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token.value}` }
  })
  if (res.ok) {
    const json = await res.json()
    user.value = json.user
  } else {
    token.value = null
    localStorage.removeItem('auth.token')
    user.value = null
  }
}

async function signup(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Signup failed')
  token.value = json.token
  localStorage.setItem('auth.token', token.value!)
  user.value = json.user
}

async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Login failed')
  token.value = json.token
  localStorage.setItem('auth.token', token.value!)
  user.value = json.user
}

function logout() {
  token.value = null
  user.value = null
  localStorage.removeItem('auth.token')
}

fetchMe()

export function useAuth() {
  return { token, user, signup, login, logout, fetchMe }
}
