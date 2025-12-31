
import bcrypt from 'bcryptjs'
import { prisma } from '../src/db'

async function main() {
  const email = 'admin@daggerheart.com'
  const password = 'admin123'
  const passwordHash = await bcrypt.hash(password, 10)

  const existing = await prisma.user.findUnique({ where: { email } })
  
  if (existing) {
    console.log(`User ${email} exists. Updating password...`)
    await prisma.user.update({
      where: { email },
      data: { passwordHash }
    })
    console.log('Password updated.')
  } else {
    console.log(`Creating user ${email}...`)
    await prisma.user.create({
      data: { 
        email, 
        passwordHash,
        role: 'ADMIN'
      }
    })
    console.log('User created.')
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
