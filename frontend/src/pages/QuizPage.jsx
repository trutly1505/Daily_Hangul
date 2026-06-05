import { useParams } from 'react-router-dom'
import PagePlaceholder from '../components/common/PagePlaceholder.jsx'

function QuizPage() {
  const { topicId = 'unknown-topic' } = useParams()

  return (
    <PagePlaceholder
      eyebrow="Quiz"
      title="Quiz route is ready"
      description="The next implementation pass can focus on question rendering, answer state, submission, and score handling."
      meta={`topicId: ${topicId}`}
    >
      <ul className="check-list">
        <li>Question rendering shell will live here.</li>
        <li>Submit flow will post answers to the backend API.</li>
        <li>Successful submissions will redirect to the result route.</li>
      </ul>
    </PagePlaceholder>
  )
}

export default QuizPage
