import { Request, Response } from 'express'
import { createMeal, filterMeal, getMeals } from '../../lib/meal.js'
import { createMealSchema } from '../../lib/schemas.js'
import { logger } from '../../lib/utils.js'

export async function get(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)

  const meals = await getMeals(req.user.id)

  res.send(meals.map(filterMeal))
}

export async function post(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)
  if (req.user.type !== 'admin') return res.sendStatus(403)

  const parsed = createMealSchema.safeParse(req.body)
  if (!parsed.success) return res.sendStatus(400)
  const { name, occasions } = parsed.data

  const meal = await createMeal({
    name,
    occasions,
    userId: req.user.id
  })

  logger.debug(
    `User ${req.user.username} created meal ${meal.name}`,
    'meals'
  )

  res.send(filterMeal(meal))
}
