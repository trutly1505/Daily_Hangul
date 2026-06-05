import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import PagePlaceholder from '../components/common/PagePlaceholder.jsx'
import { useAuth } from '../hooks/useAuth.js'
import authService from '../services/authService.js'
import { getApiErrorMessage } from '../utils/getApiErrorMessage.js'
import { validateLoginForm } from '../utils/validators.js'

const initialValues = {
  email: '',
  password: '',
}

function LoginPage() {
  const { isAuthenticated, isHydrated, setSession } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [values, setValues] = useState(initialValues)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectTo = location.state?.from?.pathname || '/dashboard'

  if (!isHydrated) {
    return (
      <PagePlaceholder
        framed={false}
        eyebrow="Authentication"
        title="Checking saved session"
        description="The auth shell is restoring local session state before rendering the form."
        meta="Route: /login"
      />
    )
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))

    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }))

    setSubmitError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextFieldErrors = validateLoginForm(values)

    setFieldErrors(nextFieldErrors)
    setSubmitError('')

    if (Object.keys(nextFieldErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      const authPayload = await authService.loginUser(values)
      setSession(authPayload)
      navigate(redirectTo, { replace: true })
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(error, 'Unable to sign in with the provided credentials.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PagePlaceholder
      framed={false}
      eyebrow="Authentication"
      title="Sign in to continue learning"
      description="Use an existing account to enter the protected study routes."
      meta="Route: /login"
    >
      <form className="form-shell" onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            name="email"
            type="email"
            value={values.email}
            placeholder="name@example.com"
            autoComplete="email"
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.email)}
          />
          {fieldErrors.email ? (
            <p className="field-error">{fieldErrors.email}</p>
          ) : null}
        </div>

        <div className="field-group">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            type="password"
            value={values.password}
            placeholder="********"
            autoComplete="current-password"
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.password)}
          />
          {fieldErrors.password ? (
            <p className="field-error">{fieldErrors.password}</p>
          ) : null}
        </div>

        {submitError ? <p className="form-message form-message--error">{submitError}</p> : null}

        <button
          type="submit"
          className="button button-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
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
