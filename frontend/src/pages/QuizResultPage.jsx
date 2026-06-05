import { Link, useParams } from 'react-router-dom'
import PagePlaceholder from '../components/common/PagePlaceholder.jsx'

function QuizResultPage() {
  const { resultId = 'unknown-result' } = useParams()

  return (
    <PagePlaceholder
      eyebrow="Results"
      title="Result summary route is wired"
      description="This page will receive score, correct answer count, and next actions once the quiz flow is connected."
      meta={`resultId: ${resultId}`}
    >
      <div className="placeholder-actions">
        <Link
          className="button button-primary"
          to={`/quiz-results/${resultId}/review`}
        >
          Review answers
        </Link>
      </div>
    </PagePlaceholder>
  )
}

export default QuizResultPage
