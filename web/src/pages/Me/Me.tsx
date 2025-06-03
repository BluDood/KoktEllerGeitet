import React, { useContext, useEffect, useState } from 'react'
import styles from './Me.module.css'
import Loader from '../../components/Loader/Loader.tsx'
import { instance } from '../../lib/api.ts'
import { useNavigate } from 'react-router'
import { UserContext } from '../../contexts/UserContext.tsx'

enum State {
  Pending,
  Loading,
  Success
}

const Me: React.FC = () => {
  const navigate = useNavigate()
  const { user, setUser } = useContext(UserContext)
  const [state, setState] = useState<State>(State.Pending)
  const usernameRef = React.createRef<HTMLInputElement>()

  async function updateProfile() {
    const username = usernameRef.current?.value

    // sjekk om brukernavn har en verdi
    if (!username) {
      alert('Username is required')
      return
    }

    setState(State.Loading)

    // oppdater brukeren i databasen
    const res = await instance.patch('/auth', { username })

    if (res.status === 200) {
      // oppdater brukeren i context
      setUser(res.data)
      setState(State.Success)
    } else {
      alert('Failed to update profile')
      setState(State.Pending)
    }
  }

  async function deleteProfile() {
    // bekreftelse før sletting
    if (!confirm('Are you sure you want to delete your profile?')) return

    // slett brukeren i databasen
    const res = await instance.delete('/auth')

    if (res.status === 204) {
      alert('Profile deleted successfully')
      // naviger til forsiden som da vil navigere til login
      navigate('/')
    } else {
      alert('Failed to delete profile')
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      // fjern check ikon etter 2 sekunder
      if (state === State.Success) setState(State.Pending)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [state])

  return user ? (
    <div className={styles.me}>
      <div className={styles.profile}>
        <div className={styles.cover}>
          <span className="material-icons">person</span>
        </div>
        <input
          type="text"
          className={styles.name}
          placeholder="Username"
          defaultValue={user.username}
          ref={usernameRef}
        />
      </div>
      <div className={styles.actions}>
        <button data-type="save" onClick={updateProfile}>
          <span className="material-icons">
            {state === State.Success
              ? 'check'
              : state === State.Loading
              ? 'hourglass_empty'
              : 'save'}
          </span>
        </button>
        <button data-type="delete" onClick={deleteProfile}>
          <span className="material-icons"> delete </span>
        </button>
      </div>
    </div>
  ) : (
    <div className={styles.loading}>
      <Loader />
    </div>
  )
}

export default Me
