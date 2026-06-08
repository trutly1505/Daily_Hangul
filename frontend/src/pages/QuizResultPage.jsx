import { CheckCircle2, RefreshCw, Target } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PagePlaceholder from '../components/common/PagePlaceholder.jsx'
import { useUiLanguage } from '../hooks/useUiLanguage.js'
import quizService from '../services/quizService.js'
import { getHeadingText, getTopicDisplayTitle } from '../utils/headingContent.js'

function QuizResultPage() {
  const { resultId = 'unknown-result' } = useParams()
  const { uiLanguage } = useUiLanguage()
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isActive = true

    async function loadResult() {
      try {
        setIsLoading(true)
        setErrorMessage('')

        const response = await quizService.getQuizResult(resultId)

        if (!isActive) {
          return
        }

        setResult(response)
      } catch (error) {
        if (!isActive) {
          return
        }

        setErrorMessage(
          error?.response?.data?.message ||
            error?.message ||
            'Không tải được kết quả quiz.',
        )
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadResult()

    return () => {
      isActive = false
    }
  }, [resultId])

  if (isLoading) {
    return (
      <PagePlaceholder
        eyebrow="Results"
        title="Đang tải kết quả"
        description="Đang lấy điểm số và câu trả lời đã lưu của lượt quiz này."
      />
    )
  }

  if (errorMessage || !result) {
    return (
      <PagePlaceholder
        eyebrow="Results"
        title="Không tải được kết quả"
        description={errorMessage || 'Không tìm thấy kết quả quiz.'}
      />
    )
  }

  const topicTitle = getTopicDisplayTitle(result.topic, uiLanguage)

  return (
    <section className="quiz-summary">
      <div className="quiz-summary__hero">
        <span className="eyebrow">Quiz saved</span>
        <h2>{getHeadingText('quizResultTitle', uiLanguage, { topicTitle, scoreLabel: result.scoreLabel })}</h2>
        <p>
          Kết quả này đã được lưu lại trong lịch sử. Anh có thể xem lại các câu sai
          hoặc làm lại quiz của topic này bất kỳ lúc nào.
        </p>
      </div>

      <div className="quiz-summary__metrics" aria-label="Quiz result summary">
        <div>
          <span>Điểm</span>
          <strong>{result.scorePercent}%</strong>
        </div>
        <div>
          <span>Đúng</span>
          <strong>{result.correctCount} câu</strong>
        </div>
        <div>
          <span>Sai</span>
          <strong>{result.wrongCount} câu</strong>
        </div>
      </div>

      {result.wrongAnswers.length ? (
        <div className="quiz-review-list">
          {result.wrongAnswers.slice(0, 3).map((answer) => (
            <article className="quiz-review-card quiz-review-card--wrong" key={answer.questionId}>
              <div className="quiz-review-card__head">
                <span>Câu {answer.order}</span>
                <strong>{answer.correctAnswer.word}</strong>
              </div>
              <p className="quiz-review-card__prompt">{answer.prompt}</p>
              <div className="quiz-review-card__difference">
                <p>
                  <span>Bạn chọn:</span> <strong>{answer.selectedOptionLabel}</strong>
                </p>
                <p>
                  <span>Đáp án đúng:</span> <strong>{answer.correctOptionLabel}</strong>
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="quiz-summary__perfect">
          <CheckCircle2 size={18} />
          <span>Không có câu sai trong lượt này.</span>
        </div>
      )}

      <div className="quiz-summary__actions">
        <Link className="button button-primary" to={`/quiz-results/${resultId}/review`}>
          <Target size={18} />
          Xem lại đáp án
        </Link>
        <Link className="button button-secondary" to={`/topics/${result.topic.slug}/quiz`}>
          <RefreshCw size={18} />
          Làm lại quiz
        </Link>
        <Link className="button button-secondary" to="/history">
          <CheckCircle2 size={18} />
          Mở lịch sử
        </Link>
      </div>
    </section>
  )
}

export default QuizResultPage
