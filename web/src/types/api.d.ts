interface Recipe {
  id: string
  name: string
  description: string
  image: string
  ingredients: string[]
  instructions: string
  category: string
  tastes: string[]
}

interface User {
  id: string
  username: string
  type: 'user' | 'admin'
}

interface Meal {
  id: string
  name: string
  occasions: string[]
}

type MealWithCount = Meal & {
  recipes: number
}

type MealWithRecipes = Meal & {
  recipes: Recipe[]
}
