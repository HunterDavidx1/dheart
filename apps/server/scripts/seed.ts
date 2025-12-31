import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { prisma } from '../src/db'

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@localhost'
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return
  }
  const passwordHash = await bcrypt.hash(password, 10)
  await prisma.user.create({
    data: { email, passwordHash, role: 'ADMIN' }
  })
}

main().then(() => process.exit(0)).catch((e) => {
  console.error(e)
  process.exit(1)
})
