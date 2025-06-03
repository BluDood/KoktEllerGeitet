import React from 'react'
import { Navigate, Route, Routes } from 'react-router'
import Layout from './components/Layout/Layout.tsx'
import Login from './pages/Login/Login.tsx'
import Register from './pages/Register/Register.tsx'
import Recipes from './pages/Recipes/Recipes.tsx'
import NewRecipe from './pages/NewRecipe/NewRecipe.tsx'
import Me from './pages/Me/Me.tsx'
import RecipeView from './pages/RecipeView/RecipeView.tsx'
import EditRecipe from './pages/EditRecipe/EditRecipe.tsx'
import Meals from './pages/Meals/Meals.tsx'
import MealView from './pages/MealView/MealView.tsx'
import EditMeal from './pages/EditMeal/EditMeal.tsx'
import NewMeal from './pages/NewMeal/NewMeal.tsx'

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to={'/recipes'} />} />
        <Route path="recipes" element={<Recipes />} />
        <Route path="recipes/:id" element={<RecipeView />} />
        <Route path="recipes/:id/edit" element={<EditRecipe />} />
        <Route path="recipes/new" element={<NewRecipe />} />
        <Route path="me" element={<Me />} />
        <Route path="meals" element={<Meals />} />
        <Route path="meals/:id" element={<MealView />} />
        <Route path="meals/:id/edit" element={<EditMeal />} />
        <Route path="meals/new" element={<NewMeal />} />
      </Route>
      <Route path="/auth">
        <Route index element={<Navigate to={'/auth/login'} />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  )
}

export default App
