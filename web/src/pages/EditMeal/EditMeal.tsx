import React, { useEffect } from 'react'
import styles from './EditMeal.module.css'
import { instance } from '../../lib/api.ts'
import { useNavigate, useParams } from 'react-router'
import Loader from '../../components/Loader/Loader.tsx'

const EditMeal: React.FC = () => {
  const navigate = useNavigate()
  const params = useParams()
  const nameRef = React.useRef<HTMLInputElement>(null)
  const occasionsRef = React.useRef<HTMLInputElement>(null)
  const [meal, setMeal] = React.useState<MealWithRecipes | null>(null)
  const [recipes, setRecipes] = React.useState<Recipe[] | null>(null)
  const newRecipeRef = React.useRef<HTMLSelectElement>(null)

  async function update() {
    const name = nameRef.current?.value
    const occasions = occasionsRef.current?.value

    // sjekk om alle feltene er fylt ut
    if (!name || !occasions) {
      alert('Please fill in all fields')
      return
    }

    // oppdater spillelisten
    const res = await instance.patch(`/meals/${params.id}`, {
      name,
      // splitt occasions siden det lagret som liste i databasen
      occasions: occasions
        .split(' ')
        .map(vibe => vibe.trim())
        .filter(vibe => vibe.length > 0),
      recipes: meal!.recipes.map(recipe => recipe.id)
    })

    if (res.status === 200) {
      // naviger tilbake til spillelisten
      navigate(`/meals/${res.data.id}`)
    } else {
      if (res.status === 400) {
        // 400 betyr at sjekken etter reglene feilet, vis melding til bruker
        alert(
          'Please ensure all recipes are in unique genres, and contain at least one common vibe.'
        )
      } else {
        alert('Error updating meal')
      }
    }
  }

  useEffect(() => {
    async function fetchMeal() {
      const res = await instance.get(`/meals/${params.id}`)

      if (res.status === 200) {
        setMeal(res.data)
      } else {
        alert('Error fetching meal')
      }
    }

    async function fetchRecipes() {
      // hent alle sanger, som gjør at brukeren kan legge til sanger i spillelisten
      const res = await instance.get('/recipes')

      if (res.status === 200) {
        setRecipes(res.data)
      } else {
        alert('Error fetching recipes')
      }
    }

    fetchMeal()
    fetchRecipes()
  }, [params.id])

  return meal && recipes ? (
    <div className={styles.update}>
      <h2>Update meal</h2>

      <div className={styles.toolbar}>
        <input
          type="text"
          className={styles.title}
          placeholder="Name"
          ref={nameRef}
          defaultValue={meal.name}
        />
        <div className={styles.actions}>
          <button className={styles.save}>
            <div className="material-icons" onClick={update}>
              save
            </div>
          </button>
        </div>
      </div>
      <div className={styles.info}>
        <div className={styles.field}>
          <h3>Occasions (space-separated)</h3>
          <input
            type="text"
            ref={occasionsRef}
            defaultValue={meal.occasions.join(' ')}
          />
        </div>
      </div>
      <div className={styles.recipes}>
        <h3>Recipes</h3>
        <div className={styles.list}>
          {meal.recipes.map((recipe, i) => (
            <div key={i} className={styles.recipe}>
              <div className={styles.text}>
                <h2>{recipe.name}</h2>
              </div>
              <button
                data-type="delete"
                onClick={() =>
                  setMeal({
                    ...meal,
                    recipes: meal.recipes.filter((_, index) => index !== i)
                  })
                }
              >
                <span className="material-icons">delete</span>
              </button>
            </div>
          ))}
          <div className={styles.recipe}>
            <select ref={newRecipeRef}>
              <option selected disabled hidden value="">
                Add a recipe
              </option>
              {recipes
                .filter(s => !meal.recipes.find(n => n.id === s.id))
                .map((recipe, i) => (
                  <option key={i} value={recipe.id}>
                    {recipe.name}
                  </option>
                ))}
            </select>
            <button
              onClick={() => {
                const recipe = recipes.find(
                  recipe => recipe.id === newRecipeRef.current?.value
                )
                if (!recipe) return
                setMeal({
                  ...meal,
                  recipes: [...meal.recipes, recipe]
                })
                newRecipeRef.current!.value = ''
              }}
            >
              <span className="material-icons">add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className={styles.loading}>
      <Loader />
    </div>
  )
}

export default EditMeal
