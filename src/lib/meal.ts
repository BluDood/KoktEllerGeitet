import { Meal, Recipe } from '../../generated/prisma/index.js'
import prisma from './prisma.js'
import { filterRecipe } from './recipes.js'
import { logger } from './utils.js'

// filtrer spilleliste for sending tilbake til bruker
// sjekk om spillelisten inkluderer sanger eller antall sanger
// og filtrer basert på det
export function filterMeal(
  meal:
    | Meal
    | (Meal & { recipes: Recipe[] })
    | (Meal & { _count: { recipes: number } })
) {
  if ('recipes' in meal) {
    return {
      id: meal.id,
      name: meal.name,
      occasions: meal.occasions,
      recipes: meal.recipes.map(filterRecipe)
    }
  } else if ('_count' in meal) {
    return {
      id: meal.id,
      name: meal.name,
      occasions: meal.occasions,
      recipes: meal._count.recipes
    }
  } else {
    return {
      id: meal.id,
      name: meal.name,
      occasions: meal.occasions
    }
  }
}

// lage spilleliste, en spilleliste har eier og må derfor ha en userId
export async function createMeal({
  name,
  occasions,
  userId
}: {
  name: string
  occasions: string[]
  userId: string
}) {
  const meal = await prisma.meal.create({
    data: {
      name,
      occasions,
      userId
    }
  })

  return meal
}

// hent en brukers spillelister, inkluderer antall sanger
export async function getMeals(userId: string) {
  const meals = await prisma.meal.findMany({
    where: {
      userId
    },
    include: {
      _count: {
        select: {
          recipes: true
        }
      }
    }
  })

  return meals
}

// hent en spilleliste, inkluderer sanger
export async function getMeal(id: string) {
  const meal = await prisma.meal.findUnique({
    where: {
      id
    },
    include: {
      recipes: true
    }
  })

  return meal
}

// oppdater spilleliste, dataen som skal oppdateres kan være valgfritt for å beholde den forrige verdien
export async function updateMeal(
  id: string,
  data: Partial<{
    name: string
    occasions: string[]
    recipes: string[]
  }>
) {
  const meal = await prisma.meal.update({
    where: {
      id
    },
    data: {
      name: data.name,
      occasions: data.occasions,
      recipes: {
        set: data.recipes?.map(id => ({ id }))
      }
    }
  })

  return meal
}

// slett spilleliste
export async function deleteMeal(id: string) {
  const meal = await prisma.meal.delete({
    where: {
      id
    }
  })

  return meal
}

// sjekk om en liste over sanger til en spilleliste er gyldig basert på regler:
// alle sanger må ha samme sjanger
// alle sanger må ha minst en felles stemning
export async function checkMealValidity(recipeIds: string[]) {
  // om det kun er en sang i spillelisten er det alltid gyldig
  if (recipeIds.length <= 1) return true
  // hent sanger fra databasen
  const recipes = await prisma.recipe.findMany({
    where: {
      id: {
        in: recipeIds
      }
    }
  })

  // hent alle sjangere fra sangene
  const allGenres = recipes.map(recipe => recipe.category)
  // bruk Set for å fjerne duplikater
  const uniqueGenres = [...new Set(allGenres)]

  // er listen over unike sjangere mindre enn listen over alle sjangere betyr det at noen sanger deler sjanger, som ikke er gyldig
  if (allGenres.length > uniqueGenres.length) {
    logger.debug(
      'Failed meal validation: Some recipes share genres',
      'MealValidation'
    )
    return false
  }

  // hent alle stemninger fra sangene
  const allVibes = recipes.map(recipe => recipe.tastes)
  // lag en liste over stemninger som er felles for alle sangene
  const sharedKeywords = allVibes.reduce((acc, keywords) => {
    return acc.filter(value => keywords.includes(value))
  })
  // hvis det ikke er noen felles stemninger ikke spillelisten gyldig
  if (sharedKeywords.length === 0) {
    logger.debug(
      'Failed meal validation: Recipes have no shared tastes',
      'MealValidation'
    )
    return false
  }

  return true
}
