'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { AuthUser } from '@/lib/types'

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  refreshUser: () => Promise<AuthUser | null>
  setUser: (user: AuthUser | null) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: ReactNode
  initialUser?: AuthUser | null
}) {
  const [user, setUser] = useState<AuthUser | null>(initialUser)
  const [isLoading, setIsLoading] = useState(false)
  const requestIdRef = useRef(0)

  const refreshUser = useCallback(async () => {
    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId

    try {
      const response = await fetch('/api/auth/me', { cache: 'no-store' })
      if (requestId !== requestIdRef.current) return null

      if (!response.ok) {
        setUser(null)
        return null
      }

      const result = (await response.json()) as { user: AuthUser | null }
      if (requestId !== requestIdRef.current) return result.user

      setUser(result.user)
      return result.user
    } catch {
      if (requestId !== requestIdRef.current) return null
      setUser(null)
      return null
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false)
      }
    }
  }, [])

  const updateUser = useCallback((nextUser: AuthUser | null) => {
    requestIdRef.current += 1
    setUser(nextUser)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const handleFocus = () => {
      void refreshUser()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [refreshUser])

  const value = useMemo(
    () => ({
      user,
      isLoading,
      refreshUser,
      setUser: updateUser,
    }),
    [user, isLoading, refreshUser, updateUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }

  return context
}
