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
import Menus from './pages/Menus/Menus.tsx'
import MenuView from './pages/MenuView/MenuView.tsx'
import EditMenu from './pages/EditMenu/EditMenu.tsx'
import NewMenu from './pages/NewMenu/NewMenu.tsx'

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
        <Route path="menus" element={<Menus />} />
        <Route path="menus/:id" element={<MenuView />} />
        <Route path="menus/:id/edit" element={<EditMenu />} />
        <Route path="menus/new" element={<NewMenu />} />
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
