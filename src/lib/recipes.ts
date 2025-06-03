import { Recipe } from '../../generated/prisma/index.js'
import prisma from './prisma.js'

// filtrer sang for sending tilbake til bruker
export function filterRecipe(recipe: Recipe) {
  return {
    id: recipe.id,
    name: recipe.name,
    image: recipe.image,
    description: recipe.description,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    category: recipe.category,
    tastes: recipe.tastes
  }
}

// hent alle sanger
export async function getRecipes() {
  const recipe = await prisma.recipe.findMany()

  return recipe
}

// hent en sang
export async function getRecipe(id: string) {
  const recipe = await prisma.recipe.findUnique({
    where: {
      id
    }
  })

  return recipe
}

// lag sang
export async function createRecipe({
  name,
  image,
  description,
  ingredients,
  instructions,
  category,
  tastes
}: {
  name: string
  image: string
  description: string
  ingredients: string[]
  instructions: string
  category: string
  tastes: string[]
}) {
  const recipe = await prisma.recipe.create({
    data: {
      name,
      image,
      description,
      ingredients,
      instructions,
      category,
      tastes
    }
  })

  return recipe
}

// oppdater sang, dataen som skal oppdateres kan være valgfritt for å beholde den forrige verdien
export async function updateRecipe(
  id: string,
  {
    name,
    image,
    description,
    ingredients,
    instructions,
    category,
    tastes
  }: {
    name?: string
    image?: string
    description?: string
    ingredients?: string[]
    instructions?: string
    category?: string
    tastes?: string[]
  }
) {
  const recipe = await prisma.recipe.update({
    where: {
      id
    },
    data: {
      name,
      image,
      description,
      ingredients,
      instructions,
      category,
      tastes
    }
  })

  return recipe
}

// slett sang
export async function deleteRecipe(id: string) {
  const recipe = await prisma.recipe.delete({
    where: {
      id
    }
  })

  return recipe
}

// søk etter sanger, som sjekker om søket finnes i en tittel, artist, sjanger eller vibe
export async function searchRecipes(query: string) {
  const recipes = await prisma.recipe.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          category: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          tastes: {
            hasSome: [query]
          }
        }
      ]
    }
  })

  return recipes
}
