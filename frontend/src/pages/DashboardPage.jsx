import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

const quickLinks = [
  {
    title: 'Topic detail',
    description: 'Skeleton route for a selected study topic.',
    to: '/topics/demo-topic',
  },
  {
    title: 'Flashcards',
    description: 'Placeholder page for topic-based flashcard practice.',
    to: '/topics/demo-topic/flashcards',
  },
  {
    title: 'Quiz flow',
    description: 'Placeholder route for the quiz submission flow.',
    to: '/topics/demo-topic/quiz',
  },
  {
    title: 'Result review',
    description: 'Route shell for reviewing submitted answers.',
    to: '/quiz-results/demo-result/review',
  },
]

function DashboardPage() {
  const { user } = useAuth()

  return (
    <>
      <section className="page-grid page-grid--dashboard">
        <article className="panel hero-panel">
          <span className="eyebrow">Protected Area</span>
          <h1>Dashboard route is guarded and ready.</h1>
          <p>
            This page is now behind the auth context and will become the main
            hub once auth and topic data are connected.
          </p>
          <div className="meta-pill">
            Signed in as {user?.name || 'Learner'}
            {user?.email ? ` - ${user.email}` : ''}
          </div>
        </article>

        <article className="panel">
          <span className="eyebrow">Structure</span>
          <h2>What this route proves</h2>
          <ul className="detail-list">
            <li>Protected routing already redirects unauthenticated users.</li>
            <li>Main layout is shared across dashboard and study pages.</li>
            <li>Topic, quiz, result, and history routes are already mapped.</li>
          </ul>
        </article>
      </section>

      <section className="panel">
        <span className="eyebrow">Quick Access</span>
        <h2>Available placeholder routes</h2>
        <div className="card-grid">
          {quickLinks.map((item) => (
            <article className="info-card" key={item.to}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="action-row">
                <Link className="button button-secondary" to={item.to}>
                  Open route
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default DashboardPage
