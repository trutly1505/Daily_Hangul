import { useState } from 'react'
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { useUiLanguage } from '../hooks/useUiLanguage.js'
import authService from '../services/authService.js'
import { getHeadingText } from '../utils/headingContent.js'
import { getApiErrorMessage } from '../utils/getApiErrorMessage.js'
import { validateLoginForm } from '../utils/validators.js'

const initialValues = {
  email: '',
  password: '',
}

function LoginPage() {
  const { isAuthenticated, isHydrated, setSession } = useAuth()
  const { uiLanguage } = useUiLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  const [values, setValues] = useState(initialValues)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectTo = location.state?.from?.pathname || '/dashboard'

  if (!isHydrated) {
    return (
      <section className="auth-form-view auth-form-view--loading">
        <span className="eyebrow">Authentication</span>
        <h2>{getHeadingText('authLoadingTitle', uiLanguage)}</h2>
        <p>Auth shell đang khôi phục trạng thái local trước khi render form.</p>
      </section>
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
    <section className="auth-form-view">
      <div className="auth-form-head">
        <span className="eyebrow">Authentication</span>
        <h2>{getHeadingText('loginTitle', uiLanguage)}</h2>
        <p>Quay lại dashboard và phiên học đang dở.</p>
      </div>

      <form className="form-shell" onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="login-email">Email</label>
          <div className="field-input-shell">
            <span className="field-icon" aria-hidden="true">
              <Mail size={18} />
            </span>
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
          </div>
          {fieldErrors.email ? (
            <p className="field-error">{fieldErrors.email}</p>
          ) : null}
        </div>

        <div className="field-group">
          <label htmlFor="login-password">Mật khẩu</label>
          <div className="field-input-shell">
            <span className="field-icon" aria-hidden="true">
              <LockKeyhole size={18} />
            </span>
            <input
              id="login-password"
              name="password"
              type="password"
              value={values.password}
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.password)}
            />
          </div>
          {fieldErrors.password ? (
            <p className="field-error">{fieldErrors.password}</p>
          ) : null}
        </div>

        {submitError ? <p className="form-message form-message--error">{submitError}</p> : null}

        <button
          type="submit"
          className="button button-primary auth-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          <ArrowRight size={18} />
        </button>
      </form>

      <div className="auth-switch">
        <span>Chưa có tài khoản?</span>
        <Link to="/register">Tạo tài khoản ngay</Link>
      </div>
    </section>
  )
}

export default LoginPage
