export const AUTH_STORAGE_KEY = 'daily-hangul-auth'

export function loadStoredSession() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY)

    if (!rawSession) {
      return null
    }

    const parsedSession = JSON.parse(rawSession)

    return {
      token: parsedSession.token ?? null,
      user: parsedSession.user ?? null,
    }
  } catch (error) {
    void error
    return null
  }
}

export function saveStoredSession(session) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export function clearStoredSession() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function getStoredToken() {
  return loadStoredSession()?.token ?? null
}
