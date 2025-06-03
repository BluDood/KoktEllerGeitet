import { Request, Response } from 'express'
import {
  createRecipe,
  filterRecipe,
  getRecipes
} from '../../lib/recipes.js'
import { createRecipeSchema } from '../../lib/schemas.js'
import { logger } from '../../lib/utils.js'

export async function get(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)

  const recipes = await getRecipes()

  res.send(recipes.map(filterRecipe))
}

export async function post(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)
  if (req.user.type !== 'admin') return res.sendStatus(403)

  const parsed = createRecipeSchema.safeParse(req.body)
  if (!parsed.success) return res.sendStatus(400)
  const {
    name,
    description,
    ingredients,
    instructions,
    image,
    category,
    tastes
  } = parsed.data

  const recipe = await createRecipe({
    name,
    description,
    image,
    ingredients,
    instructions,
    category,
    tastes
  })

  logger.debug(
    `User ${req.user.username} created recipe ${recipe.name}`,
    'recipes'
  )

  res.send(filterRecipe(recipe))
}
