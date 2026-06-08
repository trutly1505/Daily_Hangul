import { Clock3, RefreshCw, Target } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PagePlaceholder from '../components/common/PagePlaceholder.jsx'
import { useUiLanguage } from '../hooks/useUiLanguage.js'
import quizService from '../services/quizService.js'
import { getHeadingText, getTopicDisplayTitle } from '../utils/headingContent.js'

function formatDate(dateValue) {
  const parsedDate = new Date(dateValue)

  if (Number.isNaN(parsedDate.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsedDate)
}

function HistoryPage() {
  const { uiLanguage } = useUiLanguage()
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isActive = true

    async function loadHistory() {
      try {
        setIsLoading(true)
        setErrorMessage('')

        const response = await quizService.getQuizHistory()

        if (!isActive) {
          return
        }

        setHistory(response)
      } catch (error) {
        if (!isActive) {
          return
        }

        setErrorMessage(
          error?.response?.data?.message ||
            error?.message ||
            'Không tải được lịch sử quiz.',
        )
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadHistory()

    return () => {
      isActive = false
    }
  }, [])

  if (isLoading) {
    return (
      <PagePlaceholder
        eyebrow="History"
        title="Đang tải lịch sử quiz"
        description="Đang lấy các lượt làm bài đã lưu theo tài khoản hiện tại."
      />
    )
  }

  if (errorMessage) {
    return (
      <PagePlaceholder
        eyebrow="History"
        title="Không tải được lịch sử"
        description={errorMessage}
      />
    )
  }

  if (!history.length) {
    return (
      <PagePlaceholder
        eyebrow="History"
        title="Chưa có lượt quiz nào được lưu"
        description="Làm ít nhất một quiz để bắt đầu thấy điểm số và lịch sử ôn tập tại đây."
      />
    )
  }

  return (
    <div className="history-page">
      <section className="history-page__header">
        <span className="eyebrow">Quiz history</span>
        <h1>{getHeadingText('historyTitle', uiLanguage)}</h1>
        <p>
          Mỗi lượt sẽ ghi lại điểm số, topic, thời gian làm bài và đường dẫn sang
          phần review chi tiết.
        </p>
      </section>

      <div className="history-list">
        {history.map((item) => (
          <article className="history-card" key={item.id}>
            <div className="history-card__head">
              <div>
                <span>{getTopicDisplayTitle(item.topic, uiLanguage)}</span>
                <strong>{item.scoreLabel}</strong>
              </div>
              <div className="history-card__score">{item.scorePercent}%</div>
            </div>

            <div className="history-card__meta">
              <span>
                <Clock3 size={16} />
                {formatDate(item.submittedAt)}
              </span>
              <span>
                <Target size={16} />
                Sai {item.wrongCount} câu
              </span>
            </div>

            <div className="history-card__actions">
              <Link className="button button-primary" to={`/quiz-results/${item.id}`}>
                Xem kết quả
              </Link>
              <Link className="button button-secondary" to={`/quiz-results/${item.id}/review`}>
                Review
              </Link>
              <Link className="button button-secondary" to={`/topics/${item.topic.slug}/quiz`}>
                <RefreshCw size={18} />
                Làm lại
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default HistoryPage
