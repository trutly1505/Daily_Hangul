import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

function ProtectedRoute() {
  const { isAuthenticated, isHydrated } = useAuth()
  const location = useLocation()

  if (!isHydrated) {
    return (
      <section className="status-panel">
        <span className="eyebrow">Session</span>
        <h2>Verifying saved session</h2>
        <p>The protected route shell is waiting for the auth context to finish hydrating.</p>
      </section>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export default ProtectedRoute
