import { Request, Response } from 'express'
import {
  checkMenuValidity,
  deleteMenu,
  filterMenu,
  getMenu,
  updateMenu
} from '../../../lib/menu.js'
import { updateMenuSchema } from '../../../lib/schemas.js'
import { logger } from '../../../lib/utils.js'

export async function get(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)

  const menu = await getMenu(req.params.id)
  if (!menu) return res.sendStatus(404)
  if (menu.userId !== req.user.id) return res.sendStatus(404)

  res.json(filterMenu(menu))
}

export async function patch(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)

  const parsed = updateMenuSchema.safeParse(req.body)
  if (!parsed.success) return res.sendStatus(400)
  const { name, occasions, recipes } = parsed.data

  const menu = await getMenu(req.params.id)

  if (!menu) return res.sendStatus(404)
  if (menu.userId !== req.user.id) return res.sendStatus(404)

  if (recipes) {
    const valid = await checkMenuValidity(recipes)

    if (!valid) return res.sendStatus(400)
  }

  const updated = await updateMenu(menu.id, {
    name,
    occasions,
    recipes
  })

  logger.debug(
    `User ${req.user.username} updated menu ${menu.name}`,
    'menus'
  )

  res.json(filterMenu(updated))
}

export async function del(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)

  const menu = await getMenu(req.params.id)
  if (!menu) return res.sendStatus(404)
  if (menu.userId !== req.user.id) return res.sendStatus(404)

  await deleteMenu(req.params.id)

  logger.debug(
    `User ${req.user.username} deleted menu ${menu.name}`,
    'menus'
  )

  res.sendStatus(204)
}
