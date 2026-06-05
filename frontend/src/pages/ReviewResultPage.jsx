import { useParams } from 'react-router-dom'
import PagePlaceholder from '../components/common/PagePlaceholder.jsx'

function ReviewResultPage() {
  const { resultId = 'unknown-result' } = useParams()

  return (
    <PagePlaceholder
      eyebrow="Review"
      title="Detailed answer review route is wired"
      description="Selected answer, correct answer, correctness state, and explanations will be rendered in this view."
      meta={`resultId: ${resultId}`}
    >
      <ul className="check-list">
        <li>Each answered question will get its own review block.</li>
        <li>Correctness styling and explanation text will live here.</li>
      </ul>
    </PagePlaceholder>
  )
}

export default ReviewResultPage
