import { Link } from 'react-router-dom'

const foundationItems = [
  'React router is wired with public, auth, and protected route groups.',
  'Main and auth layouts are separated so feature work stays modular.',
  'The backend now has environment loading, health routing, and error handling.',
]

const nextMilestones = [
  'Connect auth forms to API endpoints and persistent sessions.',
  'Replace placeholder dashboard blocks with real topic and history data.',
  'Start wiring flashcards, quiz flow, and result review pages.',
]

function LandingPage() {
  return (
    <>
      <section className="page-grid">
        <article className="panel hero-panel">
          <span className="eyebrow">Project Shell</span>
          <h1>Daily Hangul is ready for feature implementation.</h1>
          <p>
            The app now has its route skeleton, layout boundaries, protected
            pages, and backend bootstrap in place.
          </p>

          <div className="action-row">
            <Link className="button button-primary" to="/register">
              Start auth flow
            </Link>
            <Link className="button button-secondary" to="/dashboard">
              Inspect app routes
            </Link>
          </div>
        </article>

        <article className="panel">
          <span className="eyebrow">Current Foundation</span>
          <h2>What is already scaffolded</h2>
          <ul className="detail-list">
            {foundationItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="panel">
        <span className="eyebrow">Next Block</span>
        <h2>What comes immediately after this step</h2>
        <div className="card-grid">
          {nextMilestones.map((item) => (
            <article className="info-card" key={item}>
              <h3>{item}</h3>
              <p>The structure is already in place for this implementation step.</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default LandingPage
