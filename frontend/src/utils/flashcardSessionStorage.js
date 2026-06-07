const FLASHCARD_SESSION_PREFIX = 'daily-hangul-flashcards'

function getStorageKey(topicSlug) {
  return `${FLASHCARD_SESSION_PREFIX}:${topicSlug}`
}

export function loadFlashcardSession(topicSlug) {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const rawSession = window.localStorage.getItem(getStorageKey(topicSlug))

    if (!rawSession) {
      return {}
    }

    const parsedSession = JSON.parse(rawSession)

    return {
      currentIndex: Number.isInteger(parsedSession.currentIndex)
        ? parsedSession.currentIndex
        : 0,
      isFlipped: Boolean(parsedSession.isFlipped),
      isCompleted: Boolean(parsedSession.isCompleted),
    }
  } catch (error) {
    void error
    return {}
  }
}

export function saveFlashcardSession(topicSlug, sessionState) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(
    getStorageKey(topicSlug),
    JSON.stringify({
      currentIndex: sessionState.currentIndex ?? 0,
      isFlipped: Boolean(sessionState.isFlipped),
      isCompleted: Boolean(sessionState.isCompleted),
    }),
  )
}

export function clearFlashcardSession(topicSlug) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(getStorageKey(topicSlug))
}
