import React, { useEffect } from 'react'
import styles from './EditMenu.module.css'
import { instance } from '../../lib/api.ts'
import { useNavigate, useParams } from 'react-router'
import Loader from '../../components/Loader/Loader.tsx'

const EditMenu: React.FC = () => {
  const navigate = useNavigate()
  const params = useParams()
  const nameRef = React.useRef<HTMLInputElement>(null)
  const occasionsRef = React.useRef<HTMLInputElement>(null)
  const [menu, setMenu] = React.useState<MenuWithRecipes | null>(null)
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

    // oppdater menyen
    const res = await instance.patch(`/menus/${params.id}`, {
      name,
      // splitt anledninger siden det lagres som liste i databasen
      occasions: occasions
        .split(' ')
        .map(vibe => vibe.trim())
        .filter(vibe => vibe.length > 0),
      recipes: menu!.recipes.map(recipe => recipe.id)
    })

    if (res.status === 200) {
      // naviger tilbake til menyen
      navigate(`/menus/${res.data.id}`)
    } else {
      if (res.status === 400) {
        // 400 betyr at sjekken etter reglene feilet, vis melding til bruker
        alert(
          'Please ensure all recipes are in unique categories, and contain at least one common taste profile.'
        )
      } else {
        alert('Error updating menu')
      }
    }
  }

  useEffect(() => {
    async function fetchMenu() {
      const res = await instance.get(`/menus/${params.id}`)

      if (res.status === 200) {
        setMenu(res.data)
      } else {
        alert('Error fetching menu')
      }
    }

    async function fetchRecipes() {
      // hent alle oppskrifter, som gjør at brukeren kan legge til oppskrifter i menyen
      const res = await instance.get('/recipes')

      if (res.status === 200) {
        setRecipes(res.data)
      } else {
        alert('Error fetching recipes')
      }
    }

    fetchMenu()
    fetchRecipes()
  }, [params.id])

  return menu && recipes ? (
    <div className={styles.update}>
      <h2>Update menu</h2>

      <div className={styles.toolbar}>
        <input
          type="text"
          className={styles.title}
          placeholder="Name"
          ref={nameRef}
          defaultValue={menu.name}
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
            defaultValue={menu.occasions.join(' ')}
          />
        </div>
      </div>
      <div className={styles.recipes}>
        <h3>Recipes</h3>
        <div className={styles.list}>
          {menu.recipes.map((recipe, i) => (
            <div key={i} className={styles.recipe}>
              <div className={styles.text}>
                <h2>{recipe.name}</h2>
              </div>
              <button
                data-type="delete"
                onClick={() =>
                  setMenu({
                    ...menu,
                    recipes: menu.recipes.filter((_, index) => index !== i)
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
                .filter(s => !menu.recipes.find(n => n.id === s.id))
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
                setMenu({
                  ...menu,
                  recipes: [...menu.recipes, recipe]
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

export default EditMenu
