import React, { useContext } from 'react'
import styles from './Titlebar.module.css'
import { Link, useNavigate } from 'react-router'
import { UserContext } from '../../contexts/UserContext.tsx'

const Titlebar: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useContext(UserContext)

  const actions = [
    { icon: 'recipe_book', action: () => navigate('/recipes') },
    { icon: 'add', action: () => navigate('/recipes/new'), admin: true },
    {
      icon: 'restaurant_menu',
      action: () => navigate('/meals')
    },
    { icon: 'person', action: () => navigate('/me') },
    {
      icon: 'logout',
      color: 'red',
      action: () => {
        if (!confirm('Are you sure you want to log out?')) return
        localStorage.removeItem('token')
        navigate('/')
      }
    }
  ]

  return (
    <div className={styles.titlebar}>
      <Link to="/" className={styles.logo}>
        <span className="material-icons">restaurant_menu</span>
        KoktEllerGeitet
      </Link>
      <div className={styles.actions}>
        {actions.map((action, i) => {
          if (action.admin && user?.type !== 'admin') return null
          return (
            <button
              key={i}
              onClick={action.action}
              data-color={action.color}
            >
              <span className="material-icons">{action.icon}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Titlebar
