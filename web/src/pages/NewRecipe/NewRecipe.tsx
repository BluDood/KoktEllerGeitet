import React from 'react'
import styles from './NewRecipe.module.css'
import { instance } from '../../lib/api.ts'
import { useNavigate } from 'react-router'

const NewRecipe: React.FC = () => {
  const navigate = useNavigate()
  const nameRef = React.useRef<HTMLInputElement>(null)
  const descriptionRef = React.useRef<HTMLInputElement>(null)
  const imageRef = React.useRef<HTMLInputElement>(null)
  const ingredientsRef = React.useRef<HTMLTextAreaElement>(null)
  const instructionsRef = React.useRef<HTMLTextAreaElement>(null)
  const genreRef = React.useRef<HTMLInputElement>(null)
  const vibesRef = React.useRef<HTMLInputElement>(null)

  async function create() {
    const name = nameRef.current?.value
    const description = descriptionRef.current?.value
    const image = imageRef.current?.value
    const ingredients = ingredientsRef.current?.value
    const instructions = instructionsRef.current?.value
    const category = genreRef.current?.value
    const tastes = vibesRef.current?.value

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

    // opprett oppskriften
    const res = await instance.post('/recipes', {
      name,
      description,
      image,
      ingredients: ingredients
        .split('\n')
        .map(ingredient => ingredient.trim())
        .filter(ingredient => ingredient.length > 0),
      instructions,
      category,
      tastes: tastes
        .split(' ')
        .map(vibe => vibe.trim())
        .filter(vibe => vibe.length > 0)
    })

    if (res.status === 200) {
      // naviger til oppskriften
      navigate(`/recipes/${res.data.id}`)
    } else {
      alert('Error creating recipe')
    }
  }

  return (
    <div className={styles.new}>
      <h2>Create new recipe</h2>
      <div className={styles.toolbar}>
        <input
          type="text"
          className={styles.name}
          placeholder="Name"
          ref={nameRef}
        />
        <div className={styles.actions}>
          <button className={styles.save}>
            <div className="material-icons" onClick={create}>
              save
            </div>
          </button>
        </div>
      </div>
      <input
        className={styles.description}
        ref={descriptionRef}
        type="text"
        placeholder="Description"
      />
      <input
        className={styles.image}
        ref={imageRef}
        type="text"
        placeholder="Image URL"
      />
      <div className={styles.info}>
        <div className={styles.field}>
          <h3>Category</h3>
          <input type="text" ref={genreRef} />
        </div>
        <div className={styles.field}>
          <h3>Tastes (space-separated)</h3>
          <input type="text" ref={vibesRef} />
        </div>
      </div>

      <div className={styles.section}>
        <h2>Ingredients (one per line)</h2>
        <textarea ref={ingredientsRef} />
      </div>
      <div className={styles.section}>
        <h2>Instructions</h2>
        <textarea ref={instructionsRef} />
      </div>
    </div>
  )
}

export default NewRecipe
