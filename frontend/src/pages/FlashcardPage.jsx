import { Link, useParams } from 'react-router-dom'
import PagePlaceholder from '../components/common/PagePlaceholder.jsx'

function FlashcardPage() {
  const { topicId = 'unknown-topic' } = useParams()

  return (
    <PagePlaceholder
      eyebrow="Flashcards"
      title="Flashcard route is ready"
      description="The page shell is in place for card flipping, navigation controls, and progress indicators."
      meta={`topicId: ${topicId}`}
    >
      <div className="placeholder-actions">
        <Link className="button button-secondary" to={`/topics/${topicId}`}>
          Back to topic
        </Link>
      </div>
    </PagePlaceholder>
  )
}

export default FlashcardPage
