import React, { createContext, useEffect, useState } from 'react'
import { instance } from '../lib/api.ts'

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {}
})

interface UserContextProviderProps {
  children: React.ReactNode
}

const UserContextProvider: React.FC<UserContextProviderProps> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    async function fetchUser() {
      const res = await instance.get('/auth')

      if (res.status === 200) {
        setUser(res.data)
      } else {
        console.error('Failed to fetch user')
      }
    }

    if (!window.location.pathname.startsWith('/auth')) fetchUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export { UserContext, UserContextProvider }
