import React, { useContext, useEffect, useState } from 'react'
import styles from './RecipeView.module.css'
import { instance } from '../../lib/api.ts'
import { useNavigate, useParams } from 'react-router'
import Loader from '../../components/Loader/Loader.tsx'
import { UserContext } from '../../contexts/UserContext.tsx'
import Markdown from 'react-markdown'

const RecipeView: React.FC = () => {
  const navigate = useNavigate()
  const params = useParams()

  const [recipe, setRecipe] = useState<Recipe | null>(null)
  // bruker-context hentes, brukes for å sjekke om bruker er admin og vise knapper for oppdatering og sletting
  const { user } = useContext(UserContext)

  async function deleteRecipe() {
    // bekreftelse før sletting
    if (!confirm('Are you sure you want to delete this recipe?')) return
    const res = await instance.delete(`/recipes/${params.id}`)

    if (res.status === 200) {
      // naviger tilbake til listen over oppskrifter
      navigate('/recipes')
    } else {
      console.error('Failed to delete recipe')
    }
  }

  useEffect(() => {
    // hent oppskrift
    async function fetchRecipe() {
      const recipe = await instance.get(`/recipes/${params.id}`)

      if (recipe.status === 200) {
        setRecipe(recipe.data)
      } else {
        if (recipe.status === 404) {
          alert('Recipe not found!')
          navigate('/recipes')
        } else {
          alert('Failed to fetch recipe')
        }
      }
    }

    fetchRecipe()
  }, [params.id, navigate])

  return recipe ? (
    <div className={styles.recipe}>
      <div className={styles.header}>
        {user?.type === 'admin' ? (
          <div className={styles.actions}>
            <button
              data-type="save"
              onClick={() => navigate(`/recipes/${params.id}/edit`)}
            >
              <span className="material-icons">edit</span>
            </button>
            <button data-type="delete" onClick={deleteRecipe}>
              <span className="material-icons"> delete </span>
            </button>
          </div>
        ) : null}
        <div className={styles.cover}>
          {/* <span className="material-icons">album</span> */}
          <img src={recipe.image} alt="" />
        </div>
        <div className={styles.info}>
          <h1>{recipe.name}</h1>
          <p>{recipe.description}</p>
          <p className={styles.details}>
            {recipe.category} • {recipe.tastes.join(', ')}
          </p>
        </div>
      </div>
      <div className={styles.ingredients}>
        <h1>Ingredients</h1>
        <ul>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>
      <div className={styles.instructions}>
        <h1>Instructions</h1>
        <Markdown>{recipe.instructions}</Markdown>
      </div>
    </div>
  ) : (
    <div className={styles.loading}>
      <Loader />
    </div>
  )
}

export default RecipeView
