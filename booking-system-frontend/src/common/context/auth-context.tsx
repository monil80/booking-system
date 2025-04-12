'use client'

import { createContext, useContext, useEffect, useState, ReactNode, Dispatch, SetStateAction, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { IUser, userDefaultValue } from '../entity/IDBUser'
import Loading from '../components/loading'
import AclGuard from '../components/acl-guard'
import { navPath } from '../config/nav-path'
import { navArray } from '../config/nav-items'
import { verifyJwt } from '../services/auth'

type AuthContextType = {
  user: IUser | null | undefined
  setUser: Dispatch<SetStateAction<IUser | null>>
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}
export const authContextDefaultValue: AuthContextType = {
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  setUser: function (value: SetStateAction<IUser | null>): void {
    this.setUser(value)
  }
}

const AuthContext = createContext<AuthContextType>(authContextDefaultValue)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()
  const [user, setUser] = useState<IUser | null>({
    ...userDefaultValue,
    token: ''
  })
  const [loading, setLoading] = useState<boolean>(true)

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const navDetail = useMemo(() => navArray.find(i => i.path === pathname), [pathname])

  const login = () => {
    localStorage.setItem('token', user?.jwt_token || '')
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('token')

    setUser(null)
    setIsAuthenticated(false)
    if (!navDetail?.isPublicPath) router.push(navPath.login)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      ;(async () => {
        const userData = await verifyJwt({ token: token })
        if (!userData?.data) {
          logout()
        }
      })()
    }
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    login()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (loading) {
    return <Loading />
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, setUser }}>
      <AclGuard storedToken={user?.jwt_token || ''}>{children}</AclGuard>
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
