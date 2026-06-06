import {
  ArrowRight,
  BookOpenText,
  BrainCircuit,
  CalendarClock,
  CheckCircle2,
  CirclePlay,
  Flame,
  Layers3,
  Target,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

const topicTracks = [
  {
    title: 'Greeting & Basics',
    progress: 62,
    summary: 'Flashcard set đang dở, còn 14 từ trước khi sang quiz.',
    nextAction: 'Tiếp tục flashcards',
    to: '/topics/demo-topic/flashcards',
  },
  {
    title: 'School Life',
    progress: 38,
    summary: 'Nhóm từ vựng trung bình, nên ôn lại cụm ghép thường gặp.',
    nextAction: 'Mở topic',
    to: '/topics/demo-topic',
  },
  {
    title: 'Travel Words',
    progress: 21,
    summary: 'Mới vào phase nhận diện mặt chữ, chưa cần quiz vội.',
    nextAction: 'Bắt đầu học',
    to: '/topics/demo-topic/flashcards',
  },
]

const reviewQueue = [
  {
    word: '학교',
    meaning: 'school',
    state: 'due now',
  },
  {
    word: '감사합니다',
    meaning: 'thank you',
    state: '15 min',
  },
  {
    word: '이름',
    meaning: 'name',
    state: 'tonight',
  },
]

const recentSessions = [
  {
    label: 'Quiz recap',
    detail: '8/10 câu đúng trong Greeting & Basics',
    to: '/quiz-results/demo-result/review',
  },
  {
    label: 'Flashcard run',
    detail: '24 thẻ đã ôn, 6 thẻ cần xem lại',
    to: '/topics/demo-topic/flashcards',
  },
  {
    label: 'Lịch sử học',
    detail: 'Xem các phiên gần nhất và thời lượng',
    to: '/history',
  },
]

const todayChecklist = [
  'Hoàn thành nốt 14 flashcard của bài hiện tại',
  'Làm quiz khi độ chính xác đạt tối thiểu 80%',
  'Ôn lại 3 thẻ đến hạn trước khi kết thúc phiên',
]

function DashboardPage() {
  const { user } = useAuth()
  const firstName = user?.name?.trim()?.split(/\s+/)[0] || 'Learner'

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div className="dashboard-hero__copy">
          <span className="eyebrow">Today</span>
          <h1>{firstName}, tiếp tục phiên Hangul đang dở.</h1>
          <p>
            Trọng tâm hôm nay là hoàn thành bài hiện tại, đẩy review queue về
            mức gọn và chỉ vào quiz khi đã đủ chắc mặt chữ.
          </p>
        </div>

        <div className="dashboard-hero__actions">
          <Link className="button button-primary" to="/topics/demo-topic/flashcards">
            <CirclePlay size={18} />
            Học tiếp
          </Link>
          <Link className="button button-secondary" to="/history">
            <CalendarClock size={18} />
            Xem lịch sử
          </Link>
        </div>

        <div className="dashboard-hero__metrics" aria-label="Session summary">
          <div>
            <span>Current lesson</span>
            <strong>Lesson 03 · Greeting & Basics</strong>
          </div>
          <div>
            <span>Review due</span>
            <strong>08 cards</strong>
          </div>
          <div>
            <span>Quiz target</span>
            <strong>80% accuracy</strong>
          </div>
        </div>
      </section>

      <section className="dashboard-workspace">
        <article className="dashboard-focus">
          <div className="dashboard-section-head">
            <div>
              <span className="eyebrow">Current lesson</span>
              <h2>Greeting & Basics</h2>
            </div>
            <Link className="dashboard-inline-link" to="/topics/demo-topic">
              Mở topic
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="dashboard-focus__grid">
            <div className="dashboard-focus__card">
              <span className="dashboard-kicker">Key phrase</span>
              <strong className="dashboard-hangul">안녕하세요</strong>
              <p>Hello / Hi</p>
            </div>

            <div className="dashboard-progress">
              <div className="dashboard-progress__head">
                <span>Tiến độ bài học</span>
                <strong>62%</strong>
              </div>
              <div className="dashboard-progress__bar" aria-hidden="true">
                <span style={{ width: '62%' }} />
              </div>
              <p>Đã qua foundation và daily phrases, còn phần quiz xác nhận.</p>
            </div>
          </div>

          <div className="dashboard-flow">
            <div className="dashboard-flow__step is-active">
              <BookOpenText size={18} />
              <div>
                <strong>Flashcards</strong>
                <span>14 thẻ còn lại</span>
              </div>
            </div>
            <div className="dashboard-flow__step">
              <Target size={18} />
              <div>
                <strong>Quiz</strong>
                <span>Mở khi accuracy ổn</span>
              </div>
            </div>
            <div className="dashboard-flow__step">
              <BrainCircuit size={18} />
              <div>
                <strong>Review</strong>
                <span>3 thẻ đến hạn hôm nay</span>
              </div>
            </div>
          </div>

          <div className="dashboard-action-row">
            <Link className="button button-primary" to="/topics/demo-topic/flashcards">
              <CirclePlay size={18} />
              Tiếp tục flashcards
            </Link>
            <Link className="button button-secondary" to="/topics/demo-topic/quiz">
              <Target size={18} />
              Sang quiz
            </Link>
          </div>
        </article>

        <aside className="dashboard-sidebar">
          <section className="dashboard-sidebar__stats" aria-label="Learning metrics">
            <div className="dashboard-stat">
              <Flame size={18} />
              <div>
                <span>Streak</span>
                <strong>06 ngày</strong>
              </div>
            </div>
            <div className="dashboard-stat">
              <Layers3 size={18} />
              <div>
                <span>Words mastered</span>
                <strong>124 từ</strong>
              </div>
            </div>
            <div className="dashboard-stat">
              <CheckCircle2 size={18} />
              <div>
                <span>Avg. quiz</span>
                <strong>82%</strong>
              </div>
            </div>
          </section>

          <section className="dashboard-agenda">
            <div className="dashboard-section-head">
              <div>
                <span className="eyebrow">Today checklist</span>
                <h2>Việc cần xong</h2>
              </div>
            </div>

            <ul className="dashboard-list">
              {todayChecklist.map((item) => (
                <li key={item}>
                  <CheckCircle2 size={16} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </section>

      <section className="dashboard-lower">
        <article className="dashboard-panel">
          <div className="dashboard-section-head">
            <div>
              <span className="eyebrow">Topic tracks</span>
              <h2>Các track đang học</h2>
            </div>
          </div>

          <div className="dashboard-track-list">
            {topicTracks.map((track) => (
              <div className="dashboard-track" key={track.title}>
                <div className="dashboard-track__top">
                  <div>
                    <strong>{track.title}</strong>
                    <p>{track.summary}</p>
                  </div>
                  <span>{track.progress}%</span>
                </div>

                <div className="dashboard-progress__bar" aria-hidden="true">
                  <span style={{ width: `${track.progress}%` }} />
                </div>

                <div className="dashboard-track__bottom">
                  <span>{track.nextAction}</span>
                  <Link className="dashboard-inline-link" to={track.to}>
                    Mở
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </article>

        <section className="dashboard-stack">
          <article className="dashboard-panel">
            <div className="dashboard-section-head">
              <div>
                <span className="eyebrow">Review queue</span>
                <h2>Thẻ đến hạn</h2>
              </div>
              <Link
                className="dashboard-inline-link"
                to="/quiz-results/demo-result/review"
              >
                Xem review
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="dashboard-queue">
              {reviewQueue.map((item) => (
                <div className="dashboard-queue__item" key={item.word}>
                  <div>
                    <strong>{item.word}</strong>
                    <p>{item.meaning}</p>
                  </div>
                  <span>{item.state}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="dashboard-panel">
            <div className="dashboard-section-head">
              <div>
                <span className="eyebrow">Recent sessions</span>
                <h2>Phiên gần nhất</h2>
              </div>
            </div>

            <div className="dashboard-recent">
              {recentSessions.map((item) => (
                <Link className="dashboard-recent__item" key={item.label} to={item.to}>
                  <div>
                    <strong>{item.label}</strong>
                    <p>{item.detail}</p>
                  </div>
                  <ArrowRight size={16} />
                </Link>
              ))}
            </div>
          </article>
        </section>
      </section>
    </div>
  )
}

export default DashboardPage
