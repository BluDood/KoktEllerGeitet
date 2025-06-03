import React, { useEffect, useRef, useState } from 'react'
import styles from './Recipes.module.css'
import { instance } from '../../lib/api.ts'
import { useNavigate } from 'react-router'
import Loader from '../../components/Loader/Loader.tsx'

const Recipes: React.FC = () => {
  const navigate = useNavigate()
  const [recipes, setRecipes] = useState<Recipe[] | null>(null)
  const queryRef = useRef<HTMLInputElement>(null)

  async function updateRecipes() {
    setRecipes(null)
    const query = queryRef.current?.value
    if (query) {
      // søk etter sanger om bruker har skrevet noe i søkefeltet
      const recipes = await instance.post('/recipes/search', {
        query
      })

      if (recipes.status === 200) {
        setRecipes(recipes.data)
      } else {
        console.error('Failed to fetch recipes')
      }
    } else {
      // hvis ikke, hent alle sanger
      const recipes = await instance.get('/recipes')

      if (recipes.status === 200) {
        setRecipes(recipes.data)
      } else {
        console.error('Failed to fetch recipes')
      }
    }
  }

  useEffect(() => {
    updateRecipes()
  }, [])

  return (
    <div className={styles.recipes}>
      <div className={styles.header}>
        <h2>All recipes</h2>
        <div className={styles.search}>
          <input
            ref={queryRef}
            type="text"
            placeholder="Search..."
            onKeyDown={e => e.key === 'Enter' && updateRecipes()}
          />
          <button onClick={updateRecipes}>
            <span className="material-icons">search</span>
          </button>
        </div>
      </div>
      {recipes ? (
        <table>
          <thead>
            <tr>
              <th>
                <span className="material-icons">book</span> Name
              </th>
              <th>
                <span className="material-icons">description</span>
                Description
              </th>
              <th>
                <span className="material-icons">category</span> Category
              </th>
              <th>
                <span className="material-icons">emoji_objects</span>
                Tastes
              </th>
            </tr>
          </thead>
          <tbody>
            {recipes &&
              recipes.map((recipe: Recipe) => (
                <tr
                  key={recipe.id}
                  onClick={() => navigate(`/recipes/${recipe.id}`)}
                >
                  <td>{recipe.name}</td>
                  <td>{recipe.description}</td>
                  <td>{recipe.category}</td>
                  <td>{recipe.tastes.join(', ')}</td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <div className={styles.loading}>
          <Loader />
        </div>
      )}
    </div>
  )
}

export default Recipes
