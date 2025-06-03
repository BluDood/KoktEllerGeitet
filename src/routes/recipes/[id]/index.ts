import { Request, Response } from 'express'
import { idSchema, updateRecipeSchema } from '../../../lib/schemas.js'
import {
  deleteRecipe,
  filterRecipe,
  getRecipe,
  updateRecipe
} from '../../../lib/recipes.js'
import { logger } from '../../../lib/utils.js'

export async function get(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)

  const parsed = idSchema.safeParse(req.params)
  if (!parsed.success) return res.sendStatus(400)
  const { id } = parsed.data

  const recipe = await getRecipe(id)
  if (!recipe) return res.sendStatus(404)

  res.send(filterRecipe(recipe))
}

export async function patch(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)
  if (req.user.type !== 'admin') return res.sendStatus(403)

  const parsedParams = idSchema.safeParse(req.params)
  if (!parsedParams.success) return res.sendStatus(400)
  const { id } = parsedParams.data

  const parsed = updateRecipeSchema.safeParse(req.body)
  if (!parsed.success) return res.sendStatus(400)
  const {
    name,
    image,
    description,
    ingredients,
    instructions,
    category,
    tastes
  } = parsed.data

  const recipe = await updateRecipe(id, {
    name,
    image,
    description,
    ingredients,
    instructions,
    category,
    tastes
  })

  logger.debug(
    `User ${req.user.username} updated recipe ${recipe.name}`,
    'recipes'
  )

  res.send(filterRecipe(recipe))
}

export async function del(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)
  if (req.user.type !== 'admin') return res.sendStatus(403)

  const parsed = idSchema.safeParse(req.params)
  if (!parsed.success) return res.sendStatus(400)
  const { id } = parsed.data

  const recipe = await getRecipe(id)
  if (!recipe) return res.sendStatus(404)

  await deleteRecipe(id)

  logger.debug(
    `User ${req.user.username} deleted recipe ${recipe.name} `,
    'recipes'
  )

  res.sendStatus(204)
}
