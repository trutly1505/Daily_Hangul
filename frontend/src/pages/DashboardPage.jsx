import {
  CirclePlay,
  LayoutList,
  NotebookPen,
  Target,
  BookOpenText,
  Pin,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PagePlaceholder from '../components/common/PagePlaceholder.jsx'
import { useAuth } from '../hooks/useAuth.js'
import topicService from '../services/topicService.js'

const learningSteps = [
  {
    icon: LayoutList,
    title: 'Chọn chủ đề',
    description: 'Mỗi topic đã có sẵn bộ từ, ví dụ và số câu quiz cơ bản.',
  },
  {
    icon: BookOpenText,
    title: 'Học flashcards',
    description: 'Đi từ nhận diện mặt chữ sang nghĩa tiếng Việt và ví dụ ngắn.',
  },
  {
    icon: Target,
    title: 'Làm quiz',
    description: 'Dùng quiz ngắn để kiểm tra lại topic vừa học ngay trong phiên.',
  },
]

function DashboardPage() {
  const { user } = useAuth()
  const [topics, setTopics] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isActive = true

    async function loadTopics() {
      try {
        setIsLoading(true)
        setErrorMessage('')

        const topicData = await topicService.getTopics()

        if (!isActive) {
          return
        }

        setTopics(topicData)
      } catch (error) {
        if (!isActive) {
          return
        }

        setErrorMessage(
          error?.response?.data?.message ||
            error?.message ||
            'Không tải được danh sách chủ đề.',
        )
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadTopics()

    return () => {
      isActive = false
    }
  }, [])

  const firstName = user?.name?.trim()?.split(/\s+/)[0] || 'Learner'
  const featuredTopic = topics[0] ?? null
  const totalWords = useMemo(
    () => topics.reduce((sum, topic) => sum + (topic.wordCount || 0), 0),
    [topics],
  )

  if (isLoading) {
    return (
      <PagePlaceholder
        eyebrow="Dashboard"
        title="Đang tải nội dung học"
        description="Dashboard đang lấy các topic đã seed từ MongoDB."
      />
    )
  }

  if (errorMessage) {
    return (
      <PagePlaceholder
        eyebrow="Dashboard"
        title="Không tải được topic"
        description={errorMessage}
      />
    )
  }

  if (!featuredTopic) {
    return (
      <PagePlaceholder
        eyebrow="Dashboard"
        title="Chưa có topic để học"
        description="Hãy seed dữ liệu vocabulary trước khi dùng dashboard học tập."
      />
    )
  }

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div className="dashboard-hero__copy">
          <span className="eyebrow">Dashboard</span>
          <h1>{firstName}, bắt đầu với các topic đã sẵn sàng để học.</h1>
          <p>
            Hai chủ đề đầu tiên đã được nạp vào hệ thống. Từ đây có thể đi thẳng
            vào flashcard hoặc quiz theo từng topic thật thay vì route demo.
          </p>
        </div>

        <div className="dashboard-hero__actions">
          <Link
            className="button button-primary"
            to={`/topics/${featuredTopic.slug}/flashcards`}
          >
            <CirclePlay size={18} />
            Học ngay
          </Link>
          <Link className="button button-secondary" to={`/topics/${featuredTopic.slug}`}>
            <NotebookPen size={18} />
            Mở topic
          </Link>
        </div>

        <div className="dashboard-hero__metrics" aria-label="Topic summary">
          <div>
            <span>Published topics</span>
            <strong>{topics.length} chủ đề</strong>
          </div>
          <div>
            <span>Word bank</span>
            <strong>{totalWords} từ vựng</strong>
          </div>
          <div>
            <span>Current level</span>
            <strong>{featuredTopic.level}</strong>
          </div>
        </div>
      </section>

      <section className="dashboard-flow-bridge" aria-label="Learning flow">
        {learningSteps.map((step, index) => {
          const Icon = step.icon
          const stepNumber = String(index + 1).padStart(2, '0')

          return (
            <article className="dashboard-note" key={step.title}>
              <div className="dashboard-note__pin" aria-hidden="true">
                <Pin size={14} strokeWidth={2.3} />
              </div>
              <div className="dashboard-note__meta">
                <span>{stepNumber}</span>
                <Icon size={18} />
              </div>
              <strong>{step.title}</strong>
              <p>{step.description}</p>
            </article>
          )
        })}
      </section>

      <section className="dashboard-panel">
        <div className="dashboard-section-head">
          <div>
            <span className="eyebrow">Topics</span>
            <h2>Các chủ đề đang có</h2>
          </div>
        </div>

        <div className="dashboard-topic-grid">
          {topics.map((topic) => (
            <article className="dashboard-topic-card" key={topic.slug}>
              <div className="dashboard-topic-card__head">
                <div>
                  <strong>{topic.title}</strong>
                  <p>{topic.description}</p>
                </div>
                <span>{topic.level}</span>
              </div>

              <div className="dashboard-topic-card__meta">
                <div>
                  <span>Từ vựng</span>
                  <strong>{topic.wordCount}</strong>
                </div>
                <div>
                  <span>Quiz</span>
                  <strong>{topic.quizQuestionCount} câu</strong>
                </div>
                <div>
                  <span>Preview</span>
                  <strong>{topic.previewWord || '-'}</strong>
                </div>
              </div>

              <div className="dashboard-topic-card__actions">
                <Link className="button button-secondary" to={`/topics/${topic.slug}`}>
                  Xem topic
                </Link>
                <Link
                  className="button button-primary"
                  to={`/topics/${topic.slug}/flashcards`}
                >
                  Học flashcards
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default DashboardPage
