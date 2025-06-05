import { Menu, Recipe } from '../../generated/prisma/index.js'
import prisma from './prisma.js'
import { filterRecipe } from './recipes.js'
import { logger } from './utils.js'

// filtrer meny for sending tilbake til bruker
// sjekk om menyen inkluderer oppskrifter eller antall oppskrifter
// og filtrer basert på det
export function filterMenu(
  menu:
    | Menu
    | (Menu & { recipes: Recipe[] })
    | (Menu & { _count: { recipes: number } })
) {
  if ('recipes' in menu) {
    return {
      id: menu.id,
      name: menu.name,
      occasions: menu.occasions,
      recipes: menu.recipes.map(filterRecipe)
    }
  } else if ('_count' in menu) {
    return {
      id: menu.id,
      name: menu.name,
      occasions: menu.occasions,
      recipes: menu._count.recipes
    }
  } else {
    return {
      id: menu.id,
      name: menu.name,
      occasions: menu.occasions
    }
  }
}

// lage meny, en meny har eier og må derfor ha en userId
export async function createMenu({
  name,
  occasions,
  userId
}: {
  name: string
  occasions: string[]
  userId: string
}) {
  const menu = await prisma.menu.create({
    data: {
      name,
      occasions,
      userId
    }
  })

  return menu
}

// hent en brukers menyer, inkluderer antall oppskrifter
export async function getMenus(userId: string) {
  const menus = await prisma.menu.findMany({
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

  return menus
}

// hent en meny, inkluderer oppskrifter
export async function getMenu(id: string) {
  const menu = await prisma.menu.findUnique({
    where: {
      id
    },
    include: {
      recipes: true
    }
  })

  return menu
}

// oppdater meny, dataen som skal oppdateres kan være valgfritt for å beholde den forrige verdien
export async function updateMenu(
  id: string,
  data: Partial<{
    name: string
    occasions: string[]
    recipes: string[]
  }>
) {
  const menu = await prisma.menu.update({
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

  return menu
}

// slett meny
export async function deleteMenu(id: string) {
  const menu = await prisma.menu.delete({
    where: {
      id
    }
  })

  return menu
}

// sjekk om en liste over oppskrifter til en meny er gyldig basert på regler:
// alle oppskrifter må ha ulike kategorier
// alle oppskrifter må ha minst en felles smaksprofil
export async function checkMenuValidity(recipeIds: string[]) {
  // om det kun er en oppskrift i menyen er det alltid gyldig
  if (recipeIds.length <= 1) return true
  // hent oppskrifter fra databasen
  const recipes = await prisma.recipe.findMany({
    where: {
      id: {
        in: recipeIds
      }
    }
  })

  // hent alle kategorier fra oppskriftene
  const allCategories = recipes.map(recipe => recipe.category)
  // bruk Set for å fjerne duplikater
  const uniqueCategories = [...new Set(allCategories)]

  // er listen over unike kategorier mindre enn listen over alle kategorier betyr det at noen oppskrifter deler kategori, som ikke er gyldig
  if (allCategories.length > uniqueCategories.length) {
    logger.debug(
      'Failed menu validation: Some recipes share genres',
      'MenuValidation'
    )
    return false
  }

  // hent alle smaksprofiler fra oppskriftene
  const allTastes = recipes.map(recipe => recipe.tastes)
  // lag en liste over smaksprofiler som er felles for alle oppskriftene
  const sharedTastes = allTastes.reduce((acc, keywords) => {
    return acc.filter(value => keywords.includes(value))
  })
  // hvis det ikke er noen felles smaksprofiler ikke menyen gyldig
  if (sharedTastes.length === 0) {
    logger.debug(
      'Failed menu validation: Recipes have no shared tastes',
      'MenuValidation'
    )
    return false
  }

  return true
}
