import { Request, Response } from 'express'
import { searchRecipeSchema } from '../../lib/schemas.js'
import { filterRecipe, searchRecipes } from '../../lib/recipes.js'

export async function post(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401)

  const parsed = searchRecipeSchema.safeParse(req.body)
  if (!parsed.success) return res.sendStatus(400)
  const { query } = parsed.data

  const results = await searchRecipes(query)

  res.send(results.map(filterRecipe))
}
