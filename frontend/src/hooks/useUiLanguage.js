import { useContext } from 'react'
import { UiLanguageContext } from '../context/uiLanguageContext.js'

export function useUiLanguage() {
  const context = useContext(UiLanguageContext)

  if (!context) {
    throw new Error('useUiLanguage must be used within a UiLanguageProvider.')
  }

  return context
}
