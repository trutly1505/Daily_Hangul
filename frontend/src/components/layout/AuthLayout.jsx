import { Link, Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    <div className="auth-shell">
      <aside className="auth-shell__aside">
        <div>
          <Link className="brand" to="/">
            Daily <span>Hangul</span>
          </Link>
          <p>
            Register, sign in, and session recovery now share one dedicated auth shell.
          </p>
        </div>

        <ul className="auth-notes">
          <li>Protected routes redirect unauthenticated users here.</li>
          <li>Session state is persisted in local storage and revalidated on reload.</li>
          <li>Auth API calls go through the shared axios client.</li>
        </ul>
      </aside>

      <main className="auth-shell__content">
        <section className="auth-card">
          <Outlet />
        </section>
      </main>
    </div>
  )
}

export default AuthLayout
