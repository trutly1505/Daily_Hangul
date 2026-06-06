import { useState } from 'react'
import { ArrowRight, LockKeyhole, Mail, Sparkles, UserRound } from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
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
      <section className="auth-form-view auth-form-view--loading">
        <span className="eyebrow">Authentication</span>
        <h2>Đang kiểm tra phiên đã lưu</h2>
        <p>Auth shell đang khôi phục trạng thái local trước khi render form.</p>
      </section>
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
    <section className="auth-form-view">
      <div className="auth-form-head">
        <span className="eyebrow">Authentication</span>
        <h2>Tạo tài khoản và bắt đầu phiên học đầu tiên.</h2>
        <p>
          Đăng ký một lần, sau đó đi thẳng vào dashboard với danh sách chủ đề,
          flashcard và quiz flow đã sẵn sàng để dùng.
        </p>
      </div>

      <div className="auth-badge-row">
        <span className="auth-badge">
          <Sparkles size={16} />
          Thiết lập người học mới
        </span>
        <span className="auth-badge">Route /register</span>
      </div>

      <form className="form-shell" onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="register-name">Họ và tên</label>
          <div className="field-input-shell">
            <span className="field-icon" aria-hidden="true">
              <UserRound size={18} />
            </span>
            <input
              id="register-name"
              name="name"
              type="text"
              value={values.name}
              placeholder="Nguyễn Văn A"
              autoComplete="name"
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.name)}
            />
          </div>
          {fieldErrors.name ? <p className="field-error">{fieldErrors.name}</p> : null}
        </div>

        <div className="field-group">
          <label htmlFor="register-email">Email</label>
          <div className="field-input-shell">
            <span className="field-icon" aria-hidden="true">
              <Mail size={18} />
            </span>
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
          </div>
          {fieldErrors.email ? <p className="field-error">{fieldErrors.email}</p> : null}
        </div>

        <div className="field-group">
          <label htmlFor="register-password">Mật khẩu</label>
          <div className="field-input-shell">
            <span className="field-icon" aria-hidden="true">
              <LockKeyhole size={18} />
            </span>
            <input
              id="register-password"
              name="password"
              type="password"
              value={values.password}
              placeholder="Tối thiểu 6 ký tự"
              autoComplete="new-password"
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.password)}
            />
          </div>
          {fieldErrors.password ? (
            <p className="field-error">{fieldErrors.password}</p>
          ) : null}
        </div>

        <div className="field-group">
          <label htmlFor="register-confirm-password">Nhập lại mật khẩu</label>
          <div className="field-input-shell">
            <span className="field-icon" aria-hidden="true">
              <LockKeyhole size={18} />
            </span>
            <input
              id="register-confirm-password"
              name="confirmPassword"
              type="password"
              value={values.confirmPassword}
              placeholder="Nhập lại mật khẩu"
              autoComplete="new-password"
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.confirmPassword)}
            />
          </div>
          {fieldErrors.confirmPassword ? (
            <p className="field-error">{fieldErrors.confirmPassword}</p>
          ) : null}
        </div>

        {submitError ? <p className="form-message form-message--error">{submitError}</p> : null}

        <button
          type="submit"
          className="button button-primary auth-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
          <ArrowRight size={18} />
        </button>
      </form>

      <div className="auth-form-note">
        <strong>Trước khi tiếp tục</strong>
        <p>
          Mật khẩu cần tối thiểu 6 ký tự. Sau khi đăng ký, app sẽ đăng nhập
          ngay và đưa anh vào protected flow.
        </p>
      </div>

      <div className="auth-switch">
        <span>Đã có tài khoản?</span>
        <Link to="/login">Đăng nhập thay vì đăng ký</Link>
      </div>
    </section>
  )
}

export default RegisterPage
