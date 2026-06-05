import { startTransition, useEffect, useState } from 'react'
import { AuthContext } from './authContext.js'
import authService from '../services/authService.js'
import {
  clearStoredSession,
  loadStoredSession,
  saveStoredSession,
} from '../utils/authStorage.js'

const defaultAuthState = {
  user: null,
  token: null,
  isHydrated: false,
}

function getInitialAuthState() {
  const storedSession = loadStoredSession()

  if (!storedSession?.token) {
    return {
      ...defaultAuthState,
      isHydrated: true,
    }
  }

  return {
    user: storedSession.user,
    token: storedSession.token,
    isHydrated: false,
  }
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(getInitialAuthState)

  useEffect(() => {
    if (!authState.token || authState.isHydrated) {
      return undefined
    }

    let isActive = true

    async function hydrateSession() {
      try {
        const user = await authService.getCurrentUser()

        if (!isActive) {
          return
        }

        const nextSession = {
          user,
          token: authState.token,
        }

        saveStoredSession(nextSession)
        startTransition(() => {
          setAuthState({
            ...nextSession,
            isHydrated: true,
          })
        })
      } catch (error) {
        if (!isActive) {
          return
        }

        const statusCode = error?.response?.status

        if (statusCode === 401 || statusCode === 404) {
          clearStoredSession()
          startTransition(() => {
            setAuthState({
              ...defaultAuthState,
              isHydrated: true,
            })
          })
          return
        }

        startTransition(() => {
          setAuthState((currentState) => ({
            ...currentState,
            isHydrated: true,
          }))
        })
      }
    }

    hydrateSession()

    return () => {
      isActive = false
    }
  }, [authState.isHydrated, authState.token])

  const setSession = ({ user, token }) => {
    const nextState = {
      user: user ?? null,
      token: token ?? null,
    }

    saveStoredSession(nextState)

    startTransition(() => {
      setAuthState({
        ...nextState,
        isHydrated: true,
      })
    })
  }

  const logout = () => {
    clearStoredSession()

    startTransition(() => {
      setAuthState({
        ...defaultAuthState,
        isHydrated: true,
      })
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        token: authState.token,
        isAuthenticated: Boolean(authState.token),
        isHydrated: authState.isHydrated,
        login: setSession,
        logout,
        setSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
