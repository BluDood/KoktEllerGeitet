import React, { useContext, useEffect, useState } from 'react'
import styles from './MealView.module.css'
import { instance } from '../../lib/api.ts'
import { useNavigate, useParams } from 'react-router'
import Loader from '../../components/Loader/Loader.tsx'
import { UserContext } from '../../contexts/UserContext.tsx'

const MealView: React.FC = () => {
  const navigate = useNavigate()
  const params = useParams()

  const [meal, setMeal] = useState<MealWithRecipes | null>(null)
  const { user } = useContext(UserContext)

  async function deleteMeal() {
    // bekreftelse før sletting
    if (!confirm('Are you sure you want to delete this meal?')) return
    const res = await instance.delete(`/meals/${params.id}`)

    if (res.status === 204) {
      // naviger tilbake til sanglisten
      navigate('/meals')
    } else {
      console.error('Failed to delete meal')
    }
  }

  useEffect(() => {
    async function updateMeal() {
      // hent spilleliste
      const meal = await instance.get(`/meals/${params.id}`)

      if (meal.status === 200) {
        setMeal(meal.data)
      } else {
        if (meal.status === 404) {
          alert('Meal not found!')
          navigate('/meals')
        } else {
          alert('Failed to fetch meal')
        }
      }
    }

    updateMeal()
  }, [params.id, navigate])

  return meal ? (
    <div className={styles.meal}>
      <div className={styles.header}>
        {user?.type === 'admin' ? (
          <div className={styles.actions}>
            <button
              data-type="save"
              onClick={() => navigate(`/meals/${params.id}/edit`)}
            >
              <span className="material-icons">edit</span>
            </button>
            <button data-type="delete" onClick={deleteMeal}>
              <span className="material-icons"> delete </span>
            </button>
          </div>
        ) : null}
        <div className={styles.cover}>
          <span className="material-icons">restaurant_menu</span>
        </div>
        <div className={styles.info}>
          <h1>{meal.name}</h1>
          <p>
            {meal.recipes.length} recipe
            {meal.recipes.length === 1 ? '' : 's'}
          </p>
          <p className={styles.details}>{meal.occasions.join(', ')}</p>
        </div>
      </div>
      <table className={styles.table}>
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
          {meal.recipes &&
            meal.recipes.map((recipe: Recipe) => (
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
    </div>
  ) : (
    <div className={styles.loading}>
      <Loader />
    </div>
  )
}

export default MealView
