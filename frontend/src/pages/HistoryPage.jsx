import PagePlaceholder from '../components/common/PagePlaceholder.jsx'

function HistoryPage() {
  return (
    <PagePlaceholder
      eyebrow="History"
      title="Result history route is protected and mapped"
      description="Once result storage is connected, this page will render the authenticated learner's previous quiz attempts."
      meta="Route: /history"
    >
      <ul className="check-list">
        <li>List of completed quizzes with dates and scores.</li>
        <li>Deep links to result summary and full answer review pages.</li>
      </ul>
    </PagePlaceholder>
  )
}

export default HistoryPage
