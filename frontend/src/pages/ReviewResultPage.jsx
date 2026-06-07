import { ArrowLeft, CheckCircle2, CircleX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PagePlaceholder from '../components/common/PagePlaceholder.jsx'
import quizService from '../services/quizService.js'

function ReviewResultPage() {
  const { resultId = 'unknown-result' } = useParams()
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
            'Không tải được phần review quiz.',
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
        eyebrow="Review"
        title="Đang tải phần review"
        description="Đang lấy lại toàn bộ đáp án của lượt quiz này."
      />
    )
  }

  if (errorMessage || !result) {
    return (
      <PagePlaceholder
        eyebrow="Review"
        title="Không tải được phần review"
        description={errorMessage || 'Không tìm thấy dữ liệu review.'}
      />
    )
  }

  return (
    <div className="quiz-review-page">
      <section className="quiz-review-page__header">
        <Link className="flashcard-back-link flashcard-back-link--surface" to={`/quiz-results/${resultId}`}>
          <ArrowLeft size={18} />
          Về kết quả
        </Link>

        <div>
          <span className="eyebrow">Answer review</span>
          <h1>
            {result.topic.title}: xem lại {result.totalQuestions} câu đã làm.
          </h1>
          <p>
            Mỗi block cho biết câu đã chọn, đáp án đúng và ví dụ gốc của từ để ôn lại
            ngay sau khi làm bài.
          </p>
        </div>
      </section>

      <div className="quiz-review-list">
        {result.answers.map((answer) => (
          <article
            className={`quiz-review-card ${
              answer.isCorrect ? 'quiz-review-card--correct' : 'quiz-review-card--wrong'
            }`}
            key={answer.questionId}
          >
            <div className="quiz-review-card__head">
              <div className="quiz-review-card__title">
                <span>Câu {answer.order}</span>
                <strong>{answer.prompt}</strong>
              </div>

              <span
                className={`quiz-answer-badge ${
                  answer.isCorrect ? 'quiz-answer-badge--correct' : 'quiz-answer-badge--wrong'
                }`}
              >
                {answer.isCorrect ? <CheckCircle2 size={16} /> : <CircleX size={16} />}
                {answer.isCorrect ? 'Đúng' : 'Sai'}
              </span>
            </div>
            <div className="quiz-review-card__context">
              <strong>{answer.correctAnswer.word}</strong>
              <p>{answer.correctAnswer.meaningVi}</p>
              {!answer.isCorrect ? (
                <div className="quiz-review-card__difference">
                  <p>
                    <span>Bạn chọn:</span> <strong>{answer.selectedOptionLabel}</strong>
                  </p>
                  <p>
                    <span>Đáp án đúng:</span> <strong>{answer.correctOptionLabel}</strong>
                  </p>
                </div>
              ) : null}
              {answer.correctAnswer.exampleVi ? (
                <p className="quiz-review-card__example">{answer.correctAnswer.exampleVi}</p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default ReviewResultPage
