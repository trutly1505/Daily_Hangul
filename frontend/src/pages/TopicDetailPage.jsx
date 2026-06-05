import { Link, useParams } from 'react-router-dom'
import PagePlaceholder from '../components/common/PagePlaceholder.jsx'

function TopicDetailPage() {
  const { topicId = 'unknown-topic' } = useParams()

  return (
    <PagePlaceholder
      eyebrow="Topic"
      title="Topic detail route is mapped"
      description="This page will host overview content, highlighted vocabulary, and entry points into flashcards or quizzes."
      meta={`topicId: ${topicId}`}
    >
      <div className="placeholder-actions">
        <Link className="button button-primary" to={`/topics/${topicId}/flashcards`}>
          Open flashcards
        </Link>
        <Link className="button button-secondary" to={`/topics/${topicId}/quiz`}>
          Open quiz
        </Link>
      </div>
    </PagePlaceholder>
  )
}

export default TopicDetailPage
