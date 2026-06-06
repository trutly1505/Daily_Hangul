import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

const publicNavigation = [{ label: 'Overview', to: '/' }]
const landingNavigation = [
  { label: 'How it works', href: '#learning-loop' },
  { label: 'Topics', href: '#topic-library' },
  { label: 'Review', href: '#review-cycle' },
]

const privateNavigation = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Lịch sử', to: '/history' },
]

function MainLayout() {
  const location = useLocation()
  const { isAuthenticated, logout, user } = useAuth()
  const navigation = isAuthenticated ? privateNavigation : publicNavigation
  const showLandingAnchors = !isAuthenticated && location.pathname === '/'

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <Link className="brand" to="/">
            Daily <span>Hangul</span>
          </Link>

          <nav className="main-nav" aria-label="Primary navigation">
            {showLandingAnchors
              ? landingNavigation.map((item) => (
                  <a key={item.href} href={item.href} className="nav-link">
                    {item.label}
                  </a>
                ))
              : navigation.map((item) => (
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
                </div>
                <button
                  type="button"
                  className="button button-danger"
                  onClick={logout}
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link className="button button-secondary" to="/login">
                  Đăng nhập
                </Link>
                <Link className="button button-primary" to="/register">
                  Tạo tài khoản
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
