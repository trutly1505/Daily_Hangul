import { Link } from 'react-router-dom'
import PagePlaceholder from '../components/common/PagePlaceholder.jsx'

function LoginPage() {
  return (
    <PagePlaceholder
      framed={false}
      eyebrow="Authentication"
      title="Sign in route is scaffolded"
      description="The real form submission and API integration will land in the auth implementation step."
      meta="Route: /login"
    >
      <form className="form-shell">
        <div className="field-group">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            placeholder="name@example.com"
            disabled
          />
        </div>

        <div className="field-group">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="********"
            disabled
          />
        </div>

        <button type="button" className="button button-primary" disabled>
          Connect login API next
        </button>
      </form>

      <div className="placeholder-actions">
        <Link className="button button-secondary" to="/register">
          Need an account?
        </Link>
      </div>
    </PagePlaceholder>
  )
}

export default LoginPage
