import { Request, Response } from 'express'
import {
  checkMealValidity,
  deleteMeal,
  filterMeal,
  getMeal,
  updateMeal
} from '../../../lib/meal.js'
import { updateMealSchema } from '../../../lib/schemas.js'
import { logger } from '../../../lib/utils.js'

export async function get(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)

  const meal = await getMeal(req.params.id)
  if (!meal) return res.sendStatus(404)
  if (meal.userId !== req.user.id) return res.sendStatus(404)

  res.json(filterMeal(meal))
}

export async function patch(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)
  if (req.user.type !== 'admin') return res.sendStatus(403)

  const parsed = updateMealSchema.safeParse(req.body)
  if (!parsed.success) return res.sendStatus(400)
  const { name, occasions, recipes } = parsed.data

  const meal = await getMeal(req.params.id)

  if (!meal) return res.sendStatus(404)
  if (meal.userId !== req.user.id) return res.sendStatus(404)

  if (recipes) {
    const valid = await checkMealValidity(recipes)

    if (!valid) return res.sendStatus(400)
  }

  const updated = await updateMeal(meal.id, {
    name,
    occasions,
    recipes
  })

  logger.debug(
    `User ${req.user.username} updated meal ${meal.name}`,
    'meals'
  )

  res.json(filterMeal(updated))
}

export async function del(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)
  if (req.user.type !== 'admin') return res.sendStatus(403)

  const meal = await getMeal(req.params.id)
  if (!meal) return res.sendStatus(404)
  if (meal.userId !== req.user.id) return res.sendStatus(404)

  await deleteMeal(req.params.id)

  logger.debug(
    `User ${req.user.username} deleted meal ${meal.name}`,
    'meals'
  )

  res.sendStatus(204)
}
