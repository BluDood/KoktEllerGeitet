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

interface Menu {
  id: string
  name: string
  occasions: string[]
}

type MenuWithCount = Menu & {
  recipes: number
}

type MenuWithRecipes = Menu & {
  recipes: Recipe[]
}
