import React from 'react'
import styles from './NewMeal.module.css'
import { instance } from '../../lib/api.ts'
import { useNavigate } from 'react-router'

const NewMeal: React.FC = () => {
  const navigate = useNavigate()
  const nameRef = React.useRef<HTMLInputElement>(null)
  const occasionsRef = React.useRef<HTMLInputElement>(null)

  async function create() {
    const name = nameRef.current?.value
    const occasions = occasionsRef.current?.value

    // sjekk om alle feltene er fylt ut
    if (!name || !occasions) {
      alert('Please fill in all fields')
      return
    }

    // opprett spillelisten
    const res = await instance.post('/meals', {
      name,
      // splitt occasions siden det lagret som liste i databasen
      occasions: occasions
        .split(' ')
        .map(vibe => vibe.trim())
        .filter(vibe => vibe.length > 0)
    })

    if (res.status === 200) {
      // naviger til spillelisten
      navigate(`/meals/${res.data.id}`)
    } else {
      alert('Error creating meal')
    }
  }

  return (
    <div className={styles.new}>
      <h2>Create new meal</h2>
      <div className={styles.toolbar}>
        <input
          type="text"
          className={styles.title}
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
      <div className={styles.info}>
        <div className={styles.field}>
          <h3>Occasions (space-separated)</h3>
          <input type="text" ref={occasionsRef} />
        </div>
      </div>
    </div>
  )
}

export default NewMeal
