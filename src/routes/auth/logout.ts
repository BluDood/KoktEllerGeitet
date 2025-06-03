import { Request, Response } from 'express'
import { deleteToken } from '../../lib/tokens.js'
import { logger } from '../../lib/utils.js'

export async function post(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)

  await deleteToken(req.user.token.hash)

  logger.debug(`User ${req.user.username} logged out`, 'auth')

  res.sendStatus(204)
}
