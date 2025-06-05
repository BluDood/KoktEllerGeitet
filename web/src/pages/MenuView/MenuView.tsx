import React, { useContext, useEffect, useState } from 'react'
import styles from './MenuView.module.css'
import { instance } from '../../lib/api.ts'
import { useNavigate, useParams } from 'react-router'
import Loader from '../../components/Loader/Loader.tsx'
import { UserContext } from '../../contexts/UserContext.tsx'

const MenuView: React.FC = () => {
  const navigate = useNavigate()
  const params = useParams()

  const [menu, setMenu] = useState<MenuWithRecipes | null>(null)
  const { user } = useContext(UserContext)

  async function deleteMenu() {
    // bekreftelse før sletting
    if (!confirm('Are you sure you want to delete this menu?')) return
    const res = await instance.delete(`/menus/${params.id}`)

    if (res.status === 204) {
      // naviger tilbake til listen over menyer
      navigate('/menus')
    } else {
      console.error('Failed to delete menu')
    }
  }

  useEffect(() => {
    async function updateMenu() {
      // hent meny
      const menu = await instance.get(`/menus/${params.id}`)

      if (menu.status === 200) {
        setMenu(menu.data)
      } else {
        if (menu.status === 404) {
          alert('Menu not found!')
          navigate('/menus')
        } else {
          alert('Failed to fetch menu')
        }
      }
    }

    updateMenu()
  }, [params.id, navigate])

  return menu ? (
    <div className={styles.menu}>
      <div className={styles.header}>
        {user?.type === 'admin' ? (
          <div className={styles.actions}>
            <button
              data-type="save"
              onClick={() => navigate(`/menus/${params.id}/edit`)}
            >
              <span className="material-icons">edit</span>
            </button>
            <button data-type="delete" onClick={deleteMenu}>
              <span className="material-icons"> delete </span>
            </button>
          </div>
        ) : null}
        <div className={styles.cover}>
          <span className="material-icons">restaurant_menu</span>
        </div>
        <div className={styles.info}>
          <h1>{menu.name}</h1>
          <p>
            {menu.recipes.length} recipe
            {menu.recipes.length === 1 ? '' : 's'}
          </p>
          <p className={styles.details}>{menu.occasions.join(', ')}</p>
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
          {menu.recipes &&
            menu.recipes.map((recipe: Recipe) => (
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

export default MenuView
