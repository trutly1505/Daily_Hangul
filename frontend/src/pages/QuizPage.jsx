import {
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PagePlaceholder from '../components/common/PagePlaceholder.jsx'
import quizService from '../services/quizService.js'

function isEditableTarget(target) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
  )
}

function QuizPage() {
  const navigate = useNavigate()
  const { topicId = 'unknown-topic' } = useParams()
  const [topic, setTopic] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isActive = true

    async function loadQuiz() {
      try {
        setIsLoading(true)
        setErrorMessage('')

        const response = await quizService.getTopicQuiz(topicId)

        if (!isActive) {
          return
        }

        setTopic(response?.topic ?? null)
        setQuestions(response?.questions ?? [])
        setCurrentIndex(0)
        setAnswers({})
        setIsSubmitting(false)
      } catch (error) {
        if (!isActive) {
          return
        }

        setErrorMessage(
          error?.response?.data?.message || error?.message || 'Không tải được quiz.',
        )
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadQuiz()

    return () => {
      isActive = false
    }
  }, [topicId])

  const currentQuestion = useMemo(() => {
    if (!questions.length) {
      return null
    }

    return questions[currentIndex] ?? questions[0]
  }, [currentIndex, questions])

  const selectedOptionId = currentQuestion ? answers[currentQuestion.id] || '' : ''
  const answeredCount = useMemo(
    () => Object.values(answers).filter(Boolean).length,
    [answers],
  )
  const progressPercent = questions.length ? (answeredCount / questions.length) * 100 : 0
  const canGoPrevious = currentIndex > 0
  const isLastQuestion = questions.length > 0 && currentIndex === questions.length - 1

  const handleBack = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate(`/topics/${topicId}`)
  }, [navigate, topicId])

  const handleSelectOption = useCallback((optionId) => {
    if (!currentQuestion) {
      return
    }

    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [currentQuestion.id]: optionId,
    }))
  }, [currentQuestion])

  const handlePrevious = useCallback(() => {
    if (!canGoPrevious) {
      return
    }

    setCurrentIndex((index) => index - 1)
  }, [canGoPrevious])

  const handleNext = useCallback(async () => {
    if (!currentQuestion || !selectedOptionId || isSubmitting) {
      return
    }

    if (isLastQuestion) {
      try {
        setIsSubmitting(true)

        const result = await quizService.submitTopicQuiz(
          topicId,
          questions.map((question) => ({
            questionId: question.id,
            selectedOptionId: answers[question.id],
          })),
        )

        navigate(`/quiz-results/${result.id}`)
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message ||
            error?.message ||
            'Không lưu được kết quả quiz.',
        )
        setIsSubmitting(false)
      }

      return
    }

    setCurrentIndex((index) => index + 1)
  }, [
    answers,
    currentQuestion,
    isLastQuestion,
    isSubmitting,
    navigate,
    questions,
    selectedOptionId,
    topicId,
  ])

  useEffect(() => {
    function handleKeyDown(event) {
      if (isEditableTarget(event.target) || isSubmitting || !currentQuestion) {
        return
      }

      const optionIndex = Number(event.key)

      if (optionIndex >= 1 && optionIndex <= currentQuestion.options.length) {
        event.preventDefault()
        handleSelectOption(currentQuestion.options[optionIndex - 1].id)
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        handlePrevious()
        return
      }

      if (event.key === 'ArrowRight' || event.key === 'Enter') {
        event.preventDefault()
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentQuestion, handleNext, handlePrevious, handleSelectOption, isSubmitting])

  if (isLoading) {
    return (
      <PagePlaceholder
        eyebrow="Quiz"
        title="Đang tải bộ câu hỏi"
        description="Đang dựng quiz từ dữ liệu topic hiện có."
      />
    )
  }

  if (errorMessage) {
    return (
      <PagePlaceholder eyebrow="Quiz" title="Không tải được quiz" description={errorMessage}>
        <div className="placeholder-actions">
          <button className="button button-secondary" onClick={handleBack} type="button">
            Quay lại
          </button>
        </div>
      </PagePlaceholder>
    )
  }

  if (!topic || !questions.length) {
    return (
      <PagePlaceholder
        eyebrow="Quiz"
        title="Topic này chưa có quiz"
        description="Hãy chuẩn bị dữ liệu câu hỏi hoặc flashcard trước khi bắt đầu."
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
    <div className="quiz-page">
      <section className="quiz-stage">
        <div className="quiz-stage__top">
          <button
            className="flashcard-back-link flashcard-back-link--surface"
            onClick={handleBack}
            type="button"
          >
            <ArrowLeft size={18} />
            Quay lại
          </button>

          <div className="quiz-stage__meta">
            <strong>{topic.title}</strong>
            <span>{currentQuestion.order} / {questions.length}</span>
          </div>
        </div>

        <div className="quiz-stage__progress" aria-label="Quiz progress">
          <div>
            <strong>{answeredCount} / {questions.length}</strong>
            <span>Đã chọn đáp án</span>
          </div>
          <div className="flashcard-progress flashcard-progress--compact" aria-hidden="true">
            <span style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <article className="quiz-card">
          <span className="quiz-card__eyebrow">
            {currentQuestion.type === 'word_to_meaning'
              ? 'Chọn nghĩa đúng'
              : 'Chọn từ Hangul đúng'}
          </span>
          <h2>{currentQuestion.prompt}</h2>
          {currentQuestion.supportText ? (
            <p className="quiz-card__support">{currentQuestion.supportText}</p>
          ) : null}

          <div className="quiz-options" role="list" aria-label="Quiz options">
            {currentQuestion.options.map((option, index) => (
              <button
                className={`quiz-option ${selectedOptionId === option.id ? 'is-selected' : ''}`}
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                type="button"
              >
                <span className="quiz-option__index">0{index + 1}</span>
                <span className="quiz-option__copy">
                  <strong>{option.label}</strong>
                  {option.subtitle ? <small>{option.subtitle}</small> : null}
                </span>
              </button>
            ))}
          </div>
        </article>

        <div className="quiz-stage__actions">
          <button
            className="button button-secondary"
            disabled={!canGoPrevious || isSubmitting}
            onClick={handlePrevious}
            type="button"
          >
            <ArrowLeft size={18} />
            Câu trước
          </button>

          <button
            className="button button-primary"
            disabled={!selectedOptionId || isSubmitting}
            onClick={handleNext}
            type="button"
          >
            {isSubmitting ? 'Đang lưu...' : isLastQuestion ? 'Nộp bài' : 'Câu tiếp'}
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  )
}

export default QuizPage
