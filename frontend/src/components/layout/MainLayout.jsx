import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import HeadingLanguageToggle from '../common/HeadingLanguageToggle.jsx'
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigation = isAuthenticated ? privateNavigation : publicNavigation
  const showLandingAnchors = !isAuthenticated && location.pathname === '/'
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <Link className="brand" to="/" onClick={closeMobileMenu}>
            Daily <span>Hangul</span>
          </Link>

          <button
            type="button"
            className="header-menu-toggle"
            aria-expanded={isMobileMenuOpen}
            aria-controls="primary-header-menu"
            aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
            onClick={() => setIsMobileMenuOpen((currentState) => !currentState)}
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div
            className={`header-menu-panel ${isMobileMenuOpen ? 'is-open' : ''}`}
            id="primary-header-menu"
          >
            <nav className="main-nav" aria-label="Primary navigation">
              {showLandingAnchors
                ? landingNavigation.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="nav-link"
                      onClick={closeMobileMenu}
                    >
                      {item.label}
                    </a>
                  ))
                : navigation.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      isActive ? 'nav-link active' : 'nav-link'
                    }
                    >
                      {item.label}
                    </NavLink>
                  ))}
            </nav>

            <div className="header-utility">
              <HeadingLanguageToggle />
            </div>

            <div className="header-actions">
              {isAuthenticated ? (
                <div className="header-session-actions">
                  <div className="user-chip">
                    {user?.name || 'Learner'}
                  </div>
                  <button
                    type="button"
                    className="button button-danger"
                    onClick={() => {
                      closeMobileMenu()
                      logout()
                    }}
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="header-guest-actions">
                  <Link
                    className="button button-secondary"
                    to="/login"
                    onClick={closeMobileMenu}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    className="button button-primary"
                    to="/register"
                    onClick={closeMobileMenu}
                  >
                    Tạo tài khoản
                  </Link>
                </div>
              )}
            </div>
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
