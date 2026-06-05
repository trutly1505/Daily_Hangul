const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLoginForm(values) {
  const errors = {}

  if (!values.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!emailPattern.test(values.email.trim())) {
    errors.email = 'Email format is invalid.'
  }

  if (!values.password) {
    errors.password = 'Password is required.'
  }

  return errors
}

export function validateRegisterForm(values) {
  const errors = validateLoginForm(values)

  if (!values.name.trim()) {
    errors.name = 'Full name is required.'
  }

  if (!values.password) {
    errors.password = 'Password is required.'
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm the password.'
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match.'
  }

  return errors
}
