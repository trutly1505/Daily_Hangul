import { useUiLanguage } from '../../hooks/useUiLanguage.js'

function HeadingLanguageToggle({ className = '' }) {
  const { uiLanguage, setUiLanguage } = useUiLanguage()

  return (
    <div
      className={`language-toggle ${className}`.trim()}
      role="group"
      aria-label="Heading language"
    >
      {['vi', 'ko'].map((languageCode) => (
        <button
          key={languageCode}
          type="button"
          className={`language-toggle__button ${
            uiLanguage === languageCode ? 'is-active' : ''
          }`.trim()}
          onClick={() => setUiLanguage(languageCode)}
          aria-pressed={uiLanguage === languageCode}
        >
          {languageCode.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

export default HeadingLanguageToggle
