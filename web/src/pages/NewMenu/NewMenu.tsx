import React from 'react'
import styles from './NewMenu.module.css'
import { instance } from '../../lib/api.ts'
import { useNavigate } from 'react-router'

const NewMenu: React.FC = () => {
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

    // opprett menyen
    const res = await instance.post('/menus', {
      name,
      // splitt anledninger siden det lagres som liste i databasen
      occasions: occasions
        .split(' ')
        .map(vibe => vibe.trim())
        .filter(vibe => vibe.length > 0)
    })

    if (res.status === 200) {
      // naviger til menyen
      navigate(`/menus/${res.data.id}`)
    } else {
      alert('Error creating menu')
    }
  }

  return (
    <div className={styles.new}>
      <h2>Create new menu</h2>
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

export default NewMenu
