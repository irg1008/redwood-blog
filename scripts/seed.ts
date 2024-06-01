import type { Prisma } from '@prisma/client'
import { db } from 'api/src/lib/db'
import {} from '@redwoodjs/auth'

type SeedUser = Omit<
  Prisma.UserUncheckedCreateInput,
  'hashedPassword' | 'salt'
> & {
  password: string
}
type SeedPost = Prisma.PostUncheckedCreateInput

const seedUsers = async () => {
  if ((await db.user.count()) > 0) {
    console.warn('Skipping User seed data import')
    return
  }

  const users: SeedUser[] = [
    {
      id: 1,
      name: 'Admin',
      email: 'ivansudevlop@gmail.com',
      password: 'v8xY4Bo92Eu32',
      roles: 'admin',
    },
    {
      name: 'Moderator',
      email: 'moderator@gmail.com',
      password: 'v8xY4Bo92Eu32',
      roles: 'moderator',
    },
  ]

  const { hashPassword } = await import('@redwoodjs/auth-dbauth-api')

  const userRecords: Prisma.UserUncheckedCreateInput[] = users.map((user) => {
    const [hashedPassword, salt] = hashPassword(user.password)
    return {
      name: user.name,
      email: user.email,
      hashedPassword,
      salt,
    }
  })

  try {
    await db.user.createMany({ data: userRecords })
  } catch (error) {
    console.warn('Failed to seed users')
    console.error(error)
  }
}

const seedPosts = async () => {
  if ((await db.post.count()) > 0) {
    console.warn('Skipping Post seed data import')
    return
  }

  const posts: SeedPost[] = [
    {
      title: 'First Post',
      slug: 'first-post',
      body: 'Neutra tacos hot chicken prism raw denim, put a bird on it enamel pin post-ironic vape cred DIY. Street art next level umami squid. Hammock hexagon glossier 8-bit banjo. Neutra la croix mixtape echo park four loko semiotics kitsch forage chambray. Semiotics salvia selfies jianbing hella shaman. Letterpress helvetica vaporware cronut, shaman butcher YOLO poke fixie hoodie gentrify woke heirloom.',
      userId: 1,
    },
    {
      title: 'Second Post',
      slug: 'second-post',
      body: 'Master cleanse gentrify irony put a bird on it hexagon enamel pin. Pop',
      userId: 1,
    },
  ]

  try {
    await db.post.createMany({ data: posts })
  } catch (error) {
    console.warn('Failed to seed posts')
    console.error(error)
  }
}

export default async () => {
  await seedUsers()
  await seedPosts()
}
