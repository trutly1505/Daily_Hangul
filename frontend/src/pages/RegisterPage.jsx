import { Link } from 'react-router-dom'
import PagePlaceholder from '../components/common/PagePlaceholder.jsx'

function RegisterPage() {
  return (
    <PagePlaceholder
      framed={false}
      eyebrow="Authentication"
      title="Register route is scaffolded"
      description="Validation rules, API submission, and session creation are the next layer to implement."
      meta="Route: /register"
    >
      <form className="form-shell">
        <div className="field-group">
          <label htmlFor="register-name">Full name</label>
          <input
            id="register-name"
            type="text"
            placeholder="Nguyen Van A"
            disabled
          />
        </div>

        <div className="field-group">
          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            type="email"
            placeholder="name@example.com"
            disabled
          />
        </div>

        <div className="field-group">
          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            placeholder="At least 6 characters"
            disabled
          />
        </div>

        <button type="button" className="button button-primary" disabled>
          Connect register API next
        </button>
      </form>

      <div className="placeholder-actions">
        <Link className="button button-secondary" to="/login">
          Already have an account?
        </Link>
      </div>
    </PagePlaceholder>
  )
}

export default RegisterPage
