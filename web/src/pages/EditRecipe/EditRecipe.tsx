import React, { useEffect } from 'react'
import styles from './EditRecipe.module.css'
import { instance } from '../../lib/api.ts'
import { useNavigate, useParams } from 'react-router'
import Loader from '../../components/Loader/Loader.tsx'

const EditRecipe: React.FC = () => {
  const navigate = useNavigate()
  const params = useParams()
  const nameRef = React.useRef<HTMLInputElement>(null)
  const descriptionRef = React.useRef<HTMLInputElement>(null)
  const imageRef = React.useRef<HTMLInputElement>(null)
  const ingredientsRef = React.useRef<HTMLTextAreaElement>(null)
  const instructionsRef = React.useRef<HTMLTextAreaElement>(null)
  const categoryRef = React.useRef<HTMLInputElement>(null)
  const tastesRef = React.useRef<HTMLInputElement>(null)
  const [recipe, setRecipe] = React.useState<Recipe | null>(null)

  async function update() {
    const name = nameRef.current?.value
    const description = descriptionRef.current?.value
    const image = imageRef.current?.value
    const ingredients = ingredientsRef.current?.value
    const instructions = instructionsRef.current?.value
    const category = categoryRef.current?.value
    const tastes = tastesRef.current?.value

    // sjekk om alle feltene er fylt ut
    if (
      !name ||
      !description ||
      !image ||
      !ingredients ||
      !instructions ||
      !category ||
      !tastes
    ) {
      alert('Please fill in all fields')
      return
    }

    // oppdater sangen
    const res = await instance.patch(`/recipes/${params.id}`, {
      name,
      description,
      image,
      ingredients: ingredients
        .split('\n')
        .map(ingredient => ingredient.trim())
        .filter(ingredient => ingredient.length > 0),
      instructions,
      category,
      // splitt tastes siden det lagret som liste i databasen
      tastes: tastes
        .split(' ')
        .map(vibe => vibe.trim())
        .filter(vibe => vibe.length > 0)
    })

    if (res.status === 200) {
      // naviger tilbake til sangen
      navigate(`/recipes/${res.data.id}`)
    } else {
      alert('Error updating recipe')
    }
  }

  useEffect(() => {
    // hent sang
    async function fetchRecipe() {
      const res = await instance.get(`/recipes/${params.id}`)

      if (res.status === 200) {
        setRecipe(res.data)
      } else {
        alert('Error fetching recipe')
      }
    }

    fetchRecipe()
  }, [params.id])

  return recipe ? (
    <div className={styles.update}>
      <h2>Update recipe</h2>

      <div className={styles.toolbar}>
        <input
          type="text"
          className={styles.name}
          placeholder="name"
          ref={nameRef}
          defaultValue={recipe.name}
        />
        <div className={styles.actions}>
          <button className={styles.save}>
            <div className="material-icons" onClick={update}>
              save
            </div>
          </button>
        </div>
      </div>
      <input
        className={styles.description}
        ref={descriptionRef}
        type="text"
        placeholder="description"
        defaultValue={recipe.description}
      />
      <input
        className={styles.image}
        ref={imageRef}
        type="text"
        placeholder="Image URL"
        defaultValue={recipe.image}
      />
      <div className={styles.info}>
        <div className={styles.field}>
          <h3>Category</h3>
          <input
            type="text"
            ref={categoryRef}
            defaultValue={recipe.category}
          />
        </div>
        <div className={styles.field}>
          <h3>Tastes (space-separated)</h3>
          <input
            type="text"
            ref={tastesRef}
            defaultValue={recipe.tastes.join(' ')}
          />
        </div>
      </div>
      <div className={styles.section}>
        <h2>Ingredients (one per line)</h2>
        <textarea
          ref={ingredientsRef}
          defaultValue={recipe.ingredients.join('\n')}
        />
      </div>
      <div className={styles.section}>
        <h2>Instructions</h2>
        <textarea
          ref={instructionsRef}
          defaultValue={recipe.instructions}
        />
      </div>
    </div>
  ) : (
    <div className={styles.loading}>
      <Loader />
    </div>
  )
}

export default EditRecipe
