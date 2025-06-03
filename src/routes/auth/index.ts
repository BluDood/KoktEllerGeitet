import { Request, Response } from 'express'
import { updateUserSchema } from '../../lib/schemas.js'
import { deleteUser, updateUser } from '../../lib/users.js'
import { logger } from '../../lib/utils.js'

export async function get(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)

  const { id, username, type } = req.user

  res.json({
    id,
    username,
    type
  })
}

export async function patch(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)

  const parsed = updateUserSchema.safeParse(req.body)
  if (!parsed.success) return res.sendStatus(400)
  const { username } = parsed.data

  await updateUser(req.user.id, { username })

  logger.debug(
    `User ${req.user.id} updated their username to ${username}`,
    'auth'
  )

  res.json({
    id: req.user.id,
    username
  })
}

export async function del(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)

  await deleteUser(req.user.id)

  logger.debug(`User ${req.user.id} deleted`, 'auth')

  res.sendStatus(204)
}
