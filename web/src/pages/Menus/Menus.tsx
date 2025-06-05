import React, { useEffect, useState } from 'react'
import styles from './Menus.module.css'
import { instance } from '../../lib/api.ts'
import { Link, useNavigate } from 'react-router'
import Loader from '../../components/Loader/Loader.tsx'

const Menus: React.FC = () => {
  const navigate = useNavigate()
  const [menus, setMenus] = useState<MenuWithCount[] | null>(null)
  const [shownMenus, setShownMenus] = useState<MenuWithCount[] | null>(
    null
  )
  const [occasion, setOccasion] = useState<string>('')

  useEffect(() => {
    // hent alle menyer for brukeren, som inkluderer antall oppskrifter
    async function fetchMenus() {
      setMenus(null)
      const menus = await instance.get<MenuWithCount[]>('/menus')

      if (menus.status === 200) {
        setMenus(menus.data)
      } else {
        console.error('Failed to fetch menus')
      }
    }

    fetchMenus()
  }, [])

  useEffect(() => {
    if (!menus) return
    // filtrer menyene hvis bruker har valgt en anledning, ellers vis alle
    setShownMenus(null)
    // timeout brukes for at elementene skal fjernes og rendres på nytt for å vise animasjon
    setTimeout(() => {
      setShownMenus(
        menus.filter(menu =>
          ['all', ''].includes(occasion)
            ? true
            : menu.occasions.includes(occasion)
        )
      )
    }, 0)
  }, [menus, occasion])

  return (
    <div className={styles.menus}>
      <div className={styles.header}>
        <h2>Your Menus</h2>
        <div className={styles.actions}>
          {menus ? (
            <select
              value={occasion}
              onChange={e => setOccasion(e.target.value)}
            >
              <option disabled hidden value="">
                Filter by occasion
              </option>
              <option value="all">All</option>
              {Array.from(
                new Set(menus.map(menu => menu.occasions).flat())
              ).map(occasion => (
                <option key={occasion} value={occasion}>
                  {occasion}
                </option>
              ))}
            </select>
          ) : null}
          <button
            className={styles.add}
            onClick={() => navigate('/menus/new')}
          >
            <span className="material-icons">add</span>
          </button>
        </div>
      </div>
      {shownMenus ? (
        <div className={styles.grid}>
          {shownMenus.map(menu => (
            <Link
              key={menu.id}
              className={styles.menu}
              to={`/menus/${menu.id}`}
            >
              <h2>{menu.name}</h2>
              <p>{menu.occasions.join(', ')}</p>
              <p>
                {menu.recipes} recipe
                {menu.recipes === 1 ? '' : 's'}
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

export default Menus
