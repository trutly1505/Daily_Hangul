import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import PagePlaceholder from '../components/common/PagePlaceholder.jsx'
import { useAuth } from '../hooks/useAuth.js'
import authService from '../services/authService.js'
import { getApiErrorMessage } from '../utils/getApiErrorMessage.js'
import { validateRegisterForm } from '../utils/validators.js'

const initialValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

function RegisterPage() {
  const { isAuthenticated, isHydrated, setSession } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState(initialValues)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isHydrated) {
    return (
      <PagePlaceholder
        framed={false}
        eyebrow="Authentication"
        title="Checking saved session"
        description="The auth shell is restoring local session state before rendering the form."
        meta="Route: /register"
      />
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
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

    const nextFieldErrors = validateRegisterForm(values)

    setFieldErrors(nextFieldErrors)
    setSubmitError('')

    if (Object.keys(nextFieldErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      const authPayload = await authService.registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      })

      setSession(authPayload)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(error, 'Unable to create an account right now.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PagePlaceholder
      framed={false}
      eyebrow="Authentication"
      title="Create your study account"
      description="Register a new learner profile and enter the protected study flow immediately."
      meta="Route: /register"
    >
      <form className="form-shell" onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="register-name">Full name</label>
          <input
            id="register-name"
            name="name"
            type="text"
            value={values.name}
            placeholder="Nguyen Van A"
            autoComplete="name"
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.name)}
          />
          {fieldErrors.name ? <p className="field-error">{fieldErrors.name}</p> : null}
        </div>

        <div className="field-group">
          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            name="email"
            type="email"
            value={values.email}
            placeholder="name@example.com"
            autoComplete="email"
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.email)}
          />
          {fieldErrors.email ? <p className="field-error">{fieldErrors.email}</p> : null}
        </div>

        <div className="field-group">
          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            name="password"
            type="password"
            value={values.password}
            placeholder="At least 6 characters"
            autoComplete="new-password"
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.password)}
          />
          {fieldErrors.password ? (
            <p className="field-error">{fieldErrors.password}</p>
          ) : null}
        </div>

        <div className="field-group">
          <label htmlFor="register-confirm-password">Confirm password</label>
          <input
            id="register-confirm-password"
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            placeholder="Repeat the password"
            autoComplete="new-password"
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.confirmPassword)}
          />
          {fieldErrors.confirmPassword ? (
            <p className="field-error">{fieldErrors.confirmPassword}</p>
          ) : null}
        </div>

        {submitError ? <p className="form-message form-message--error">{submitError}</p> : null}

        <button
          type="submit"
          className="button button-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
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
