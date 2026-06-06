import { BookOpenText, ShieldCheck } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'

const authHighlights = [
  {
    icon: ShieldCheck,
    label: 'Lưu phiên học',
  },
  {
    icon: BookOpenText,
    label: 'Vào thẳng dashboard',
  },
]

function AuthLayout() {
  return (
    <div className="auth-shell">
      <aside className="auth-shell__aside">
        <div className="auth-shell__intro">
          <Link className="brand" to="/">
            Daily <span>Hangul</span>
          </Link>
          <span className="eyebrow">Study Access</span>
          <h1>Tiếp tục phiên học Daily Hangul.</h1>
          <p>
            Đăng nhập hoặc tạo tài khoản để lưu tiến độ, flashcard và kết quả
            quiz trong cùng một flow học.
          </p>
        </div>

        <div className="auth-shell__highlights">
          {authHighlights.map((item) => {
            const Icon = item.icon

            return (
              <div className="auth-highlight" key={item.label}>
                <Icon size={16} />
                <span>{item.label}</span>
              </div>
            )
          })}
        </div>
      </aside>

      <main className="auth-shell__content">
        <section className="auth-card">
          <Outlet />
        </section>
      </main>
    </div>
  )
}

export default AuthLayout
