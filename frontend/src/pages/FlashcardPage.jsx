import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  CheckCircle2,
  RefreshCw,
  RotateCcw,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PagePlaceholder from '../components/common/PagePlaceholder.jsx'
import topicService from '../services/topicService.js'
import {
  clearFlashcardSession,
  loadFlashcardSession,
  saveFlashcardSession,
} from '../utils/flashcardSessionStorage.js'

const defaultSessionState = {
  currentIndex: 0,
  isFlipped: false,
  isCompleted: false,
}

function isEditableTarget(target) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
  )
}

function FlashcardPage() {
  const navigate = useNavigate()
  const { topicId = 'unknown-topic' } = useParams()
  const [topic, setTopic] = useState(null)
  const [cards, setCards] = useState([])
  const [sessionState, setSessionState] = useState(defaultSessionState)
  const [cardMotion, setCardMotion] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isActive = true

    async function loadFlashcards() {
      try {
        setIsLoading(true)
        setErrorMessage('')

        const response = await topicService.getTopicFlashcards(topicId)

        if (!isActive) {
          return
        }

        const nextCards = response?.flashcards ?? []
        const savedSession = loadFlashcardSession(topicId)
        const lastIndex = Math.max(nextCards.length - 1, 0)
        const currentIndex = Math.min(savedSession.currentIndex ?? 0, lastIndex)
        const isCompleted = Boolean(savedSession.isCompleted) && nextCards.length > 0

        setTopic(response?.topic ?? null)
        setCards(nextCards)
        setSessionState({
          currentIndex,
          isFlipped: isCompleted ? false : Boolean(savedSession.isFlipped),
          isCompleted,
        })
      } catch (error) {
        if (!isActive) {
          return
        }

        setErrorMessage(
          error?.response?.data?.message ||
            error?.message ||
            'Không tải được bộ flashcard.',
        )
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadFlashcards()

    return () => {
      isActive = false
    }
  }, [topicId])

  useEffect(() => {
    if (!cards.length) {
      return
    }

    saveFlashcardSession(topicId, sessionState)
  }, [cards.length, sessionState, topicId])

  useEffect(() => {
    if (!cardMotion) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setCardMotion('')
    }, 320)

    return () => {
      window.clearTimeout(timer)
    }
  }, [cardMotion])

  const currentCard = useMemo(() => {
    if (!cards.length) {
      return null
    }

    return cards[sessionState.currentIndex] ?? cards[0]
  }, [cards, sessionState.currentIndex])

  const progressPercent = useMemo(() => {
    if (!cards.length) {
      return 0
    }

    if (sessionState.isCompleted) {
      return 100
    }

    return ((sessionState.currentIndex + 1) / cards.length) * 100
  }, [cards.length, sessionState.currentIndex, sessionState.isCompleted])

  const progressLabel = cards.length
    ? `${sessionState.isCompleted ? cards.length : sessionState.currentIndex + 1} / ${cards.length}`
    : '0 / 0'

  const faceLabel = sessionState.isCompleted
    ? 'Hoàn thành'
    : sessionState.isFlipped
      ? 'Mặt sau'
      : 'Mặt trước'

  const canGoPrevious = !sessionState.isCompleted && sessionState.currentIndex > 0
  const isLastCard = cards.length > 0 && sessionState.currentIndex === cards.length - 1

  const handleBack = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate(`/topics/${topicId}`)
  }, [navigate, topicId])

  const handleFlip = useCallback(() => {
    if (sessionState.isCompleted || !currentCard) {
      return
    }

    setSessionState((currentState) => ({
      ...currentState,
      isFlipped: !currentState.isFlipped,
    }))
  }, [currentCard, sessionState.isCompleted])

  const handlePrevious = useCallback(() => {
    if (!canGoPrevious) {
      return
    }

    setCardMotion('previous')
    setSessionState((currentState) => ({
      ...currentState,
      currentIndex: currentState.currentIndex - 1,
      isFlipped: false,
    }))
  }, [canGoPrevious])

  const handleNext = useCallback(() => {
    if (!cards.length || sessionState.isCompleted) {
      return
    }

    if (isLastCard) {
      setSessionState((currentState) => ({
        ...currentState,
        isCompleted: true,
        isFlipped: false,
      }))
      return
    }

    setCardMotion('next')
    setSessionState((currentState) => ({
      ...currentState,
      currentIndex: currentState.currentIndex + 1,
      isFlipped: false,
    }))
  }, [cards.length, isLastCard, sessionState.isCompleted])

  const handleRestart = useCallback(() => {
    clearFlashcardSession(topicId)
    setSessionState(defaultSessionState)
  }, [topicId])

  useEffect(() => {
    function handleKeyDown(event) {
      if (isEditableTarget(event.target)) {
        return
      }

      if (event.key === 'Enter') {
        event.preventDefault()
        handleFlip()
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        handlePrevious()
        return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleFlip, handleNext, handlePrevious])

  if (isLoading) {
    return (
      <PagePlaceholder
        eyebrow="Flashcards"
        title="Đang tải bộ thẻ"
        description="Đang lấy topic và danh sách flashcard theo đúng thứ tự học."
      />
    )
  }

  if (errorMessage) {
    return (
      <PagePlaceholder
        eyebrow="Flashcards"
        title="Không tải được flashcard"
        description={errorMessage}
      >
        <div className="placeholder-actions">
          <button className="button button-secondary" onClick={handleBack} type="button">
            Quay lại
          </button>
        </div>
      </PagePlaceholder>
    )
  }

  if (!topic || !cards.length) {
    return (
      <PagePlaceholder
        eyebrow="Flashcards"
        title="Topic này chưa có thẻ học"
        description="Hãy seed dữ liệu topic trước khi bắt đầu phiên flashcard."
      >
        <div className="placeholder-actions">
          <button className="button button-secondary" onClick={handleBack} type="button">
            Quay lại
          </button>
        </div>
      </PagePlaceholder>
    )
  }

  return (
    <div className="flashcard-page">
      {sessionState.isCompleted ? (
        <section className="flashcard-summary">
          <div className="flashcard-summary__content">
            <span className="eyebrow">Session done</span>
            <h2>Đã học xong bộ thẻ của {topic.title}.</h2>
            <p>
              Bạn đã đi hết {cards.length} flashcard trong topic này. Có thể học lại
              từ đầu hoặc quay về topic để tiếp tục các bước khác sau đó.
            </p>
          </div>

          <div className="flashcard-summary__actions">
            <button className="button button-primary" onClick={handleRestart} type="button">
              <RotateCcw size={18} />
              Học lại từ đầu
            </button>
            <Link className="button button-secondary" to={`/topics/${topicId}`}>
              <BookOpenText size={18} />
              Về topic
            </Link>
            <Link className="button button-secondary" to="/dashboard">
              <CheckCircle2 size={18} />
              Về dashboard
            </Link>
          </div>
        </section>
      ) : (
        <section className="flashcard-stage">
          <div className="flashcard-stage__top">
            <button
              className="flashcard-back-link flashcard-back-link--surface"
              onClick={handleBack}
              type="button"
            >
              <ArrowLeft size={18} />
              Quay lại
            </button>
          </div>

          <button
            aria-label={sessionState.isFlipped ? 'Lật về mặt trước' : 'Lật sang mặt sau'}
            aria-pressed={sessionState.isFlipped}
            className={`flashcard-card ${sessionState.isFlipped ? 'is-flipped' : ''} ${
              cardMotion ? `is-transitioning is-transitioning--${cardMotion}` : ''
            }`}
            onClick={handleFlip}
            type="button"
          >
            <div className="flashcard-card__face flashcard-card__face--front">
              <span className="flashcard-card__eyebrow">Mặt trước</span>
              <strong className="flashcard-card__word">{currentCard.word}</strong>
              <p>Nhấn vào thẻ để xem nghĩa, cách đọc và ví dụ đi kèm.</p>
            </div>

            <div className="flashcard-card__face flashcard-card__face--back">
              <span className="flashcard-card__eyebrow">Mặt sau</span>
              <strong className="flashcard-card__meaning">{currentCard.meaningVi}</strong>
              {currentCard.pronunciation ? (
                <span className="flashcard-card__pronunciation">
                  {currentCard.pronunciation}
                </span>
              ) : null}

              {(currentCard.exampleKo || currentCard.exampleVi) && (
                <div className="flashcard-card__example">
                  {currentCard.exampleKo ? <strong>{currentCard.exampleKo}</strong> : null}
                  {currentCard.exampleVi ? <p>{currentCard.exampleVi}</p> : null}
                </div>
              )}
            </div>
          </button>

          <div className="flashcard-stage__progress" aria-label="Flashcard session progress">
            <div className="flashcard-stage__progress-copy">
              <strong>{progressLabel}</strong>
              <span>
                {topic.title} · {faceLabel}
              </span>
            </div>
            <div className="flashcard-progress flashcard-progress--compact" aria-hidden="true">
              <span style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="flashcard-stage__controls">
            <button
              className="button button-secondary"
              disabled={!canGoPrevious}
              onClick={handlePrevious}
              type="button"
            >
              <ArrowLeft size={18} />
              Thẻ trước
            </button>

            <button className="button button-secondary" onClick={handleFlip} type="button">
              <RefreshCw size={18} />
              Lật thẻ
            </button>

            <button className="button button-primary" onClick={handleNext} type="button">
              {isLastCard ? 'Hoàn tất' : 'Thẻ tiếp'}
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
      )}
    </div>
  )
}

export default FlashcardPage
