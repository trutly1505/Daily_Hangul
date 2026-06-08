import { ArrowLeft, BookOpenText, Target } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PagePlaceholder from '../components/common/PagePlaceholder.jsx'
import { useUiLanguage } from '../hooks/useUiLanguage.js'
import topicService from '../services/topicService.js'
import { getTopicDisplayTitle } from '../utils/headingContent.js'

function TopicDetailPage() {
  const navigate = useNavigate()
  const { uiLanguage } = useUiLanguage()
  const { topicId = 'unknown-topic' } = useParams()
  const [topic, setTopic] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isActive = true

    async function loadTopic() {
      try {
        setIsLoading(true)
        setErrorMessage('')

        const response = await topicService.getTopic(topicId)

        if (!isActive) {
          return
        }

        setTopic(response ?? null)
      } catch (error) {
        if (!isActive) {
          return
        }

        setErrorMessage(
          error?.response?.data?.message ||
            error?.message ||
            'Không tải được nội dung của topic.',
        )
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadTopic()

    return () => {
      isActive = false
    }
  }, [topicId])

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/dashboard')
  }

  if (isLoading) {
    return (
      <PagePlaceholder
        eyebrow="Topic"
        title="Đang tải topic"
        description="Đang lấy mô tả của chủ đề này."
      />
    )
  }

  if (errorMessage) {
    return (
      <PagePlaceholder eyebrow="Topic" title="Không tải được topic" description={errorMessage}>
        <div className="placeholder-actions">
          <button className="button button-secondary" onClick={handleBack} type="button">
            Quay lại
          </button>
        </div>
      </PagePlaceholder>
    )
  }

  if (!topic) {
    return (
      <PagePlaceholder
        eyebrow="Topic"
        title="Không tìm thấy topic"
        description="Topic này chưa sẵn sàng hoặc chưa có dữ liệu công khai."
      >
        <div className="placeholder-actions">
          <button className="button button-secondary" onClick={handleBack} type="button">
            Quay lại
          </button>
        </div>
      </PagePlaceholder>
    )
  }

  const topicTitle = getTopicDisplayTitle(topic, uiLanguage)

  return (
    <div className="topic-detail-page">
      <section className="topic-detail-hero">
        <button className="topic-detail-back-link" onClick={handleBack} type="button">
          <ArrowLeft size={18} />
          Quay lại
        </button>

        <div className="topic-detail-hero__content topic-detail-hero__content--simple">
          <div className="topic-detail-hero__copy">
            <span className="eyebrow">Topic</span>
            <h1>{topicTitle}</h1>
            <p>{topic.description}</p>

            <div className="topic-detail-hero__facts" aria-label="Topic summary">
              <div className="topic-detail-fact">
                <span>Trình độ</span>
                <strong>{topic.level}</strong>
              </div>
              <div className="topic-detail-fact">
                <span>Từ vựng</span>
                <strong>{topic.wordCount} từ</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="topic-detail-hero__actions">
          <Link className="button button-primary" to={`/topics/${topicId}/flashcards`}>
            <BookOpenText size={18} />
            Học flashcards
          </Link>
          <Link className="button button-secondary" to={`/topics/${topicId}/quiz`}>
            <Target size={18} />
            Làm quiz
          </Link>
        </div>
      </section>
    </div>
  )
}

export default TopicDetailPage
