import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

const publicNavigation = [{ label: 'Overview', to: '/' }]

const privateNavigation = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'History', to: '/history' },
]

function MainLayout() {
  const { isAuthenticated, logout, user } = useAuth()
  const navigation = isAuthenticated
    ? [...publicNavigation, ...privateNavigation]
    : publicNavigation

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <Link className="brand" to="/">
            Daily <span>Hangul</span>
          </Link>

          <nav className="main-nav" aria-label="Primary navigation">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            {isAuthenticated ? (
              <>
                <div className="user-chip">
                  {user?.name || 'Learner'}
                  {user?.email ? ` - ${user.email}` : ''}
                </div>
                <button
                  type="button"
                  className="button button-danger"
                  onClick={logout}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link className="button button-secondary" to="/login">
                  Sign in
                </Link>
                <Link className="button button-primary" to="/register">
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="page-container">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
