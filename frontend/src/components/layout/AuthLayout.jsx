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
        </div>

        <div className="auth-shell__media" aria-hidden="true">
          <dotlottie-wc
            class="auth-lottie"
            src="https://lottie.host/9711c88a-634e-44ce-bec0-8bf975c1c35e/nuFSZ4Ukql.lottie"
            autoplay
            loop
          />
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
