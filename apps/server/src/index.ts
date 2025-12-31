import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './db'

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

interface Room {
  id: string
  name: string
  players: Player[]
  gm?: Player
  createdAt: string
  owner_user_id?: string
}

interface Player {
  id: string
  name: string
  isGM: boolean
}

const rooms = new Map<string, Room>()
const users = new Map<string, { id: string, email: string, passwordHash: string, createdAt: string }>()
const assets = {
  characters: new Map<string, any[]>(),
  enemies: new Map<string, any[]>(),
  dice_sets: new Map<string, any[]>(),
  maps: new Map<string, any[]>(),
}
const roomAssets = new Map<string, { characters: any[], enemies: any[], dice_sets: any[], maps: any[] }>()

function authMiddleware(req: any, res: any, next: any) {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any
    req.user = { id: payload.sub, email: payload.email }
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

app.post('/auth/signup', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' })
  const found = await prisma.user.findUnique({ where: { email } })
  if (found) return res.status(400).json({ error: 'Email taken' })
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { email, passwordHash } })
  const token = jwt.sign({ sub: user.id, email }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, user: { id: user.id, email: user.email } })
})

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
  const token = jwt.sign({ sub: user.id, email }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, user: { id: user.id, email: user.email } })
})

app.get('/me', authMiddleware, (req: any, res) => {
  res.json({ user: req.user })
})

app.get('/api/rooms', async (req, res) => {
  const list = await prisma.room.findMany()
  const mapped = list.map(r => {
    let pj = { players: [], gm: undefined }
    try {
      pj = JSON.parse(r.playersJson)
    } catch (e) {}
    
    return { id: r.id, name: r.name, players: pj.players || [], gm: pj.gm, createdAt: r.createdAt.toISOString(), owner_user_id: r.ownerId || undefined }
  })
  res.json(mapped)
})

app.post('/api/rooms/create', async (req: any, res) => {
  const { name, playerName } = req.body
  
  const roomId = Math.random().toString(36).substr(2, 9)
  const player: Player = {
    id: Math.random().toString(36).substr(2, 9),
    name: playerName,
    isGM: true
  }
  
  const ownerId = (() => {
    const auth = req.headers.authorization || ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
    try {
      if (!token) return undefined
      const payload = jwt.verify(token, JWT_SECRET) as any
      return payload.sub as string
    } catch {
      return undefined
    }
  })()

  const created = await prisma.room.create({
    data: {
      id: roomId,
      name,
      ownerId,
      playersJson: JSON.stringify({ players: [player], gm: player })
    }
  })
  const room: Room = { id: created.id, name: created.name, players: [player], gm: player, createdAt: created.createdAt.toISOString(), owner_user_id: ownerId }
  res.json({ room, player })
})

app.post('/api/rooms/:roomId/join', async (req, res) => {
  const { roomId } = req.params
  const { playerName, password } = req.body
  
  const r = await prisma.room.findUnique({ where: { id: roomId } })
  if (!r) {
    return res.status(404).json({ error: 'Room not found' })
  }
  let pj: any = { players: [] }
  try {
    pj = JSON.parse(r.playersJson)
  } catch (e) {}

  if ((pj.players || []).length >= 7) {
    return res.status(400).json({ error: 'Room is full' })
  }
  
  const player: Player = {
    id: Math.random().toString(36).substr(2, 9),
    name: playerName,
    isGM: false
  }
  
  const nextPlayers = [...(pj.players || []), player]
  const updated = await prisma.room.update({ where: { id: roomId }, data: { playersJson: JSON.stringify({ players: nextPlayers, gm: pj.gm }) } })
  const room: Room = { id: updated.id, name: updated.name, players: nextPlayers, gm: (pj.gm as any), createdAt: updated.createdAt.toISOString(), owner_user_id: updated.ownerId || undefined }
  res.json({ room, player })
})

app.post('/api/rooms/:roomId/assets/add', authMiddleware, async (req: any, res) => {
  const { roomId } = req.params
  const { assetType, asset } = req.body
  const room = await prisma.room.findUnique({ where: { id: roomId } })
  if (!room) return res.status(404).json({ error: 'Room not found' })
  if (!['characters','enemies','dice_sets','maps'].includes(assetType)) return res.status(400).json({ error: 'Invalid type' })
  if ((assetType === 'enemies' || assetType === 'maps') && req.user.id !== room.ownerId) {
    return res.status(403).json({ error: 'Only GM can add this asset type' })
  }
  await prisma.roomAsset.create({ data: { roomId, type: assetType, data: JSON.stringify(asset) } })
  io.to(roomId).emit('RoomAssetAdded', { assetType, asset })
  res.json({ ok: true })
})
app.get('/assets', authMiddleware, async (req: any, res) => {
  const { type } = req.query as any
  const userId = req.user.id
  if (!['characters','enemies','dice_sets','maps'].includes(type)) return res.status(400).json({ error: 'Invalid type' })
  const list = await prisma.asset.findMany({ where: { ownerId: userId, type } })
  const items = list.map(a => {
    try {
      return { id: a.id, ...JSON.parse(a.data) }
    } catch {
      return { id: a.id }
    }
  })
  res.json({ items })
})

app.post('/assets/characters', authMiddleware, async (req: any, res) => {
  const userId = req.user.id
  const dataObj = { ...req.body, owner_user_id: userId, created_at: new Date().toISOString() }
  const created = await prisma.asset.create({ data: { ownerId: userId, type: 'characters', data: JSON.stringify(dataObj) } })
  const item = { id: created.id, ...dataObj }
  io.emit('AssetCreated', { type: 'characters', item, owner_user_id: userId })
  res.json({ item })
})

app.put('/assets/characters/:id', authMiddleware, async (req: any, res) => {
  const userId = req.user.id
  const existing = await prisma.asset.findUnique({ where: { id: req.params.id } })
  if (!existing || existing.ownerId !== userId || existing.type !== 'characters') return res.status(404).json({ error: 'Not found' })
  
  let currentData = {}
  try { currentData = JSON.parse(existing.data) } catch {}
  
  const nextData = { ...currentData, ...req.body, updated_at: new Date().toISOString() }
  const updated = await prisma.asset.update({ where: { id: req.params.id }, data: { data: JSON.stringify(nextData) } })
  const item = { id: updated.id, ...nextData }
  io.emit('AssetUpdated', { type: 'characters', item, owner_user_id: userId })
  res.json({ item })
})

app.delete('/assets/characters/:id', authMiddleware, async (req: any, res) => {
  const userId = req.user.id
  const existing = await prisma.asset.findUnique({ where: { id: req.params.id } })
  if (!existing || existing.ownerId !== userId || existing.type !== 'characters') return res.status(404).json({ error: 'Not found' })
  await prisma.asset.delete({ where: { id: req.params.id } })
  io.emit('AssetDeleted', { type: 'characters', id: req.params.id, owner_user_id: userId })
  res.json({ ok: true })
})

app.post('/assets/enemies', authMiddleware, async (req: any, res) => {
  const userId = req.user.id
  const dataObj = { ...req.body, owner_user_id: userId, created_at: new Date().toISOString() }
  const created = await prisma.asset.create({ data: { ownerId: userId, type: 'enemies', data: JSON.stringify(dataObj) } })
  const item = { id: created.id, ...dataObj }
  io.emit('AssetCreated', { type: 'enemies', item, owner_user_id: userId })
  res.json({ item })
})

app.put('/assets/enemies/:id', authMiddleware, async (req: any, res) => {
  const userId = req.user.id
  const existing = await prisma.asset.findUnique({ where: { id: req.params.id } })
  if (!existing || existing.ownerId !== userId || existing.type !== 'enemies') return res.status(404).json({ error: 'Not found' })
  
  let currentData = {}
  try { currentData = JSON.parse(existing.data) } catch {}

  const nextData = { ...currentData, ...req.body, updated_at: new Date().toISOString() }
  const updated = await prisma.asset.update({ where: { id: req.params.id }, data: { data: JSON.stringify(nextData) } })
  const item = { id: updated.id, ...nextData }
  io.emit('AssetUpdated', { type: 'enemies', item, owner_user_id: userId })
  res.json({ item })
})

app.delete('/assets/enemies/:id', authMiddleware, async (req: any, res) => {
  const userId = req.user.id
  const existing = await prisma.asset.findUnique({ where: { id: req.params.id } })
  if (!existing || existing.ownerId !== userId || existing.type !== 'enemies') return res.status(404).json({ error: 'Not found' })
  await prisma.asset.delete({ where: { id: req.params.id } })
  io.emit('AssetDeleted', { type: 'enemies', id: req.params.id, owner_user_id: userId })
  res.json({ ok: true })
})

app.post('/assets/dice_sets', authMiddleware, async (req: any, res) => {
  const userId = req.user.id
  const dataObj = { ...req.body, owner_user_id: userId, created_at: new Date().toISOString() }
  const created = await prisma.asset.create({ data: { ownerId: userId, type: 'dice_sets', data: JSON.stringify(dataObj) } })
  const item = { id: created.id, ...dataObj }
  io.emit('AssetCreated', { type: 'dice_sets', item, owner_user_id: userId })
  res.json({ item })
})

app.put('/assets/dice_sets/:id', authMiddleware, async (req: any, res) => {
  const userId = req.user.id
  const existing = await prisma.asset.findUnique({ where: { id: req.params.id } })
  if (!existing || existing.ownerId !== userId || existing.type !== 'dice_sets') return res.status(404).json({ error: 'Not found' })
  
  let currentData = {}
  try { currentData = JSON.parse(existing.data) } catch {}

  const nextData = { ...currentData, ...req.body, updated_at: new Date().toISOString() }
  const updated = await prisma.asset.update({ where: { id: req.params.id }, data: { data: JSON.stringify(nextData) } })
  const item = { id: updated.id, ...nextData }
  io.emit('AssetUpdated', { type: 'dice_sets', item, owner_user_id: userId })
  res.json({ item })
})

app.delete('/assets/dice_sets/:id', authMiddleware, async (req: any, res) => {
  const userId = req.user.id
  const existing = await prisma.asset.findUnique({ where: { id: req.params.id } })
  if (!existing || existing.ownerId !== userId || existing.type !== 'dice_sets') return res.status(404).json({ error: 'Not found' })
  await prisma.asset.delete({ where: { id: req.params.id } })
  io.emit('AssetDeleted', { type: 'dice_sets', id: req.params.id, owner_user_id: userId })
  res.json({ ok: true })
})

app.post('/assets/maps', authMiddleware, async (req: any, res) => {
  const userId = req.user.id
  const dataObj = { ...req.body, owner_user_id: userId, created_at: new Date().toISOString() }
  const created = await prisma.asset.create({ data: { ownerId: userId, type: 'maps', data: JSON.stringify(dataObj) } })
  const item = { id: created.id, ...dataObj }
  io.emit('AssetCreated', { type: 'maps', item, owner_user_id: userId })
  res.json({ item })
})

app.put('/assets/maps/:id', authMiddleware, async (req: any, res) => {
  const userId = req.user.id
  const existing = await prisma.asset.findUnique({ where: { id: req.params.id } })
  if (!existing || existing.ownerId !== userId || existing.type !== 'maps') return res.status(404).json({ error: 'Not found' })
  
  let currentData = {}
  try { currentData = JSON.parse(existing.data) } catch {}

  const nextData = { ...currentData, ...req.body, updated_at: new Date().toISOString() }
  const updated = await prisma.asset.update({ where: { id: req.params.id }, data: { data: JSON.stringify(nextData) } })
  const item = { id: updated.id, ...nextData }
  io.emit('AssetUpdated', { type: 'maps', item, owner_user_id: userId })
  res.json({ item })
})

app.delete('/assets/maps/:id', authMiddleware, async (req: any, res) => {
  const userId = req.user.id
  const existing = await prisma.asset.findUnique({ where: { id: req.params.id } })
  if (!existing || existing.ownerId !== userId || existing.type !== 'maps') return res.status(404).json({ error: 'Not found' })
  await prisma.asset.delete({ where: { id: req.params.id } })
  io.emit('AssetDeleted', { type: 'maps', id: req.params.id, owner_user_id: userId })
  res.json({ ok: true })
})

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)
  
  socket.on('joinRoom', (data) => {
    const { roomId, player } = data
    socket.join(roomId)
    
    socket.to(roomId).emit('playerJoined', {
      player,
      message: `${player.name} joined the room`
    })
    
    console.log(`Player ${player.name} joined room ${roomId}`)
  })
  
  socket.on('stateSync', (data) => {
    const { roomId, state } = data
    socket.to(roomId).emit('stateSync', state)
  })
  
  socket.on('logPosted', (data) => {
    const { roomId, log } = data
    socket.to(roomId).emit('logPosted', log)
  })
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
