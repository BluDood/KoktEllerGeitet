import React, { useEffect, useState } from 'react'
import styles from './Meals.module.css'
import { instance } from '../../lib/api.ts'
import { Link, useNavigate } from 'react-router'
import Loader from '../../components/Loader/Loader.tsx'

const Meals: React.FC = () => {
  const navigate = useNavigate()
  const [meals, setMeals] = useState<MealWithCount[] | null>(null)
  const [shownMeals, setShownMeals] = useState<MealWithCount[] | null>(
    null
  )
  const [occasion, setOccasion] = useState<string>('')

  useEffect(() => {
    // hent alle spillelister for brukeren, som inkluderer antall sanger
    async function fetchMeals() {
      setMeals(null)
      const meals = await instance.get<MealWithCount[]>('/meals')

      if (meals.status === 200) {
        setMeals(meals.data)
      } else {
        console.error('Failed to fetch meals')
      }
    }

    fetchMeals()
  }, [])

  useEffect(() => {
    if (!meals) return
    // filtrer spillelistene hvis bruker har valgt en anledning, ellers vis alle
    setShownMeals(null)
    // timeout brukes for at elementene skal fjernes og rendres på nytt for å vise animasjon
    setTimeout(() => {
      setShownMeals(
        meals.filter(meal =>
          ['all', ''].includes(occasion)
            ? true
            : meal.occasions.includes(occasion)
        )
      )
    }, 0)
  }, [meals, occasion])

  return (
    <div className={styles.meals}>
      <div className={styles.header}>
        <h2>Your Meals</h2>
        <div className={styles.actions}>
          {meals ? (
            <select
              value={occasion}
              onChange={e => setOccasion(e.target.value)}
            >
              <option disabled hidden value="">
                Filter by occasion
              </option>
              <option value="all">All</option>
              {Array.from(
                new Set(meals.map(meal => meal.occasions).flat())
              ).map(occasion => (
                <option key={occasion} value={occasion}>
                  {occasion}
                </option>
              ))}
            </select>
          ) : null}
          <button
            className={styles.add}
            onClick={() => navigate('/meals/new')}
          >
            <span className="material-icons">add</span>
          </button>
        </div>
      </div>
      {shownMeals ? (
        <div className={styles.grid}>
          {shownMeals.map(meal => (
            <Link
              key={meal.id}
              className={styles.meal}
              to={`/meals/${meal.id}`}
            >
              <h2>{meal.name}</h2>
              <p>{meal.occasions.join(', ')}</p>
              <p>
                {meal.recipes} recipe
                {meal.recipes === 1 ? '' : 's'}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.loading}>
          <Loader />
        </div>
      )}
    </div>
  )
}

export default Meals
