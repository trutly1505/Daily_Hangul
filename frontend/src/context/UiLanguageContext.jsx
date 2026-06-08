import { useEffect, useMemo, useState } from 'react'
import { UiLanguageContext } from './uiLanguageContext.js'

const UI_LANGUAGE_STORAGE_KEY = 'daily-hangul-ui-language'

function loadStoredLanguage() {
  if (typeof window === 'undefined') {
    return 'vi'
  }

  const storedLanguage = window.localStorage.getItem(UI_LANGUAGE_STORAGE_KEY)
  return storedLanguage === 'ko' ? 'ko' : 'vi'
}

export function UiLanguageProvider({ children }) {
  const [uiLanguage, setUiLanguage] = useState(loadStoredLanguage)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(UI_LANGUAGE_STORAGE_KEY, uiLanguage)
  }, [uiLanguage])

  const value = useMemo(
    () => ({
      uiLanguage,
      setUiLanguage,
    }),
    [uiLanguage],
  )

  return (
    <UiLanguageContext.Provider value={value}>
      {children}
    </UiLanguageContext.Provider>
  )
}

export default UiLanguageProvider
