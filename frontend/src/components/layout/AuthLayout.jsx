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
            This auth area is now wired into the router and ready for the real
            register, login, and session flows.
          </p>
        </div>

        <ul className="auth-notes">
          <li>Route shell is live for `/login` and `/register`.</li>
          <li>Protected routes already redirect unauthenticated users here.</li>
          <li>Backend auth endpoints can be connected in the next implementation step.</li>
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
