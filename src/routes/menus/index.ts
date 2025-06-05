import { Request, Response } from 'express'
import { createMenu, filterMenu, getMenus } from '../../lib/menu.js'
import { createMenuSchema } from '../../lib/schemas.js'
import { logger } from '../../lib/utils.js'

export async function get(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)

  const menus = await getMenus(req.user.id)

  res.send(menus.map(filterMenu))
}

export async function post(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)

  const parsed = createMenuSchema.safeParse(req.body)
  if (!parsed.success) return res.sendStatus(400)
  const { name, occasions } = parsed.data

  const menu = await createMenu({
    name,
    occasions,
    userId: req.user.id
  })

  logger.debug(
    `User ${req.user.username} created menu ${menu.name}`,
    'menus'
  )

  res.send(filterMenu(menu))
}
