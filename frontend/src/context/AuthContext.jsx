import { useState } from 'react'
import { AuthContext } from './authContext.js'

const AUTH_STORAGE_KEY = 'daily-hangul-auth'

const defaultAuthState = {
  user: null,
  token: null,
  isHydrated: true,
}

function getInitialAuthState() {
  if (typeof window === 'undefined') {
    return defaultAuthState
  }

  try {
    const storedSession = window.localStorage.getItem(AUTH_STORAGE_KEY)

    if (storedSession) {
      const parsedSession = JSON.parse(storedSession)

      return {
        user: parsedSession.user ?? null,
        token: parsedSession.token ?? null,
        isHydrated: true,
      }
    }
  } catch (error) {
    void error
  }

  return defaultAuthState
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(getInitialAuthState)

  const login = ({ user, token }) => {
    const nextState = {
      user: user ?? null,
      token: token ?? null,
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextState))
    }

    setAuthState({
      ...nextState,
      isHydrated: true,
    })
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
    }

    setAuthState(defaultAuthState)
  }

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        token: authState.token,
        isAuthenticated: Boolean(authState.token),
        isHydrated: authState.isHydrated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
