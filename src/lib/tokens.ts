import prisma from './prisma.js'
import { hash, random } from './utils.js'

export const filterToken = (token: { id: string; createdAt: Date }) => ({
  id: token.id,
  createdAt: token.createdAt
})

export async function createToken(userId: string) {
  const token = random(64)

  const details = await prisma.token.create({
    data: {
      id: random(16),
      userId,
      hash: hash(token)
    }
  })

  return {
    ...filterToken(details),
    token
  }
}

export async function getToken(token: string, withUser = false) {
  return await prisma.token.findFirst({
    where: {
      hash: hash(token)
    },
    include: {
      user: withUser
    }
  })
}

export async function getTokenById(id: string) {
  return await prisma.token.findFirst({
    where: {
      id
    }
  })
}

export async function getTokens(userId: string) {
  return await prisma.token.findMany({
    where: {
      userId
    }
  })
}

export async function deleteTokenById(id: string) {
  return await prisma.token.delete({
    where: {
      id
    }
  })
}

export async function deleteToken(tokenHash: string) {
  return await prisma.token.delete({
    where: {
      hash: tokenHash
    }
  })
}

export async function deleteTokens({
  userId,
  keep
}: {
  userId: string
  keep: string
}) {
  return await prisma.token.deleteMany({
    where: {
      userId,
      NOT: {
        hash: hash(keep)
      }
    }
  })
}
