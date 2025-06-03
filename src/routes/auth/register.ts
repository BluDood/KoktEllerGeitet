import { Request, Response } from 'express'
import { registerSchema } from '../../lib/schemas.js'
import { createToken } from '../../lib/tokens.js'
import { createUser, getUserByUsername } from '../../lib/users.js'
import { logger } from '../../lib/utils.js'

export async function post(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) return res.sendStatus(400)
  const { username, password } = parsed.data

  if (await getUserByUsername(username)) return res.sendStatus(409)

  const user = await createUser({ username, password })
  const token = await createToken(user.id)

  logger.debug(`User ${user.username} registered`, 'auth')

  return res.json({
    token: token.token,
    user: {
      id: user.id,
      username: user.username,
      type: user.type
    }
  })
}
