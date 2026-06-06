import {
  BookOpenText,
  Clock3,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Outlet } from 'react-router-dom'

const authNotes = [
  {
    icon: ShieldCheck,
    title: 'Phiên học an toàn',
    description:
      'Token được giữ local để anh quay lại đúng phiên học đang dở.',
  },
  {
    icon: BookOpenText,
    title: 'Flow học theo chủ đề',
    description:
      'Đăng nhập xong là vào thẳng dashboard, flashcard và quiz liền mạch.',
  },
  {
    icon: Target,
    title: 'Ôn lại có trọng tâm',
    description:
      'Kết quả và các từ sai được giữ lại để tiếp tục học ngay hôm sau.',
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
          <h1>Đăng nhập để giữ lại nhịp học Hangul mỗi ngày.</h1>
          <p>
            Một tài khoản để lưu tiến độ, quay lại đúng chủ đề đang học và xem
            lại các từ cần ôn tiếp.
          </p>
        </div>

        <div className="auth-preview">
          <div className="auth-preview__header">
            <div>
              <span className="landing-kicker">Today&apos;s rhythm</span>
              <strong>Greeting &amp; Basics</strong>
            </div>
            <span className="auth-preview__badge">
              <Clock3 size={16} />
              12 min
            </span>
          </div>

          <div className="auth-preview__card">
            <span className="landing-kicker">Quick review</span>
            <strong className="hangul-note">안녕하세요</strong>
            <p>Hello / Hi</p>
            <div className="landing-chip-row">
              <span className="landing-chip">flashcard</span>
              <span className="landing-chip">quiz next</span>
            </div>
          </div>

          <div className="auth-preview__stats">
            <div>
              <span>Current streak</span>
              <strong>7 days</strong>
            </div>
            <div>
              <span>Ready topics</span>
              <strong>12 sets</strong>
            </div>
          </div>
        </div>

        <ul className="auth-notes">
          {authNotes.map((item) => {
            const Icon = item.icon

            return (
              <li key={item.title}>
                <span className="auth-note__icon">
                  <Icon size={18} />
                </span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
              </li>
            )
          })}
        </ul>

        <div className="auth-shell__footer">
          <Sparkles size={18} />
          <span>Auth shell đồng bộ với landing và study dashboard.</span>
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
