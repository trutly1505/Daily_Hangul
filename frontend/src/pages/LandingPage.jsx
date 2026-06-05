import {
  ArrowRight,
  BookOpenText,
  CheckCircle2,
  Clock3,
  Layers3,
  NotebookPen,
  Play,
  Repeat2,
  Sparkles,
  Target,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const studyLoop = [
  {
    icon: BookOpenText,
    title: 'Chọn đúng chủ đề',
    description:
      'Tập trung vào những nhóm từ vựng thật sự cần dùng thay vì học lan man.',
  },
  {
    icon: Layers3,
    title: 'Lật flashcard có ngữ cảnh',
    description:
      'Nhìn chữ Hangul, nghĩa, phiên âm và ví dụ ngắn trong cùng một nhịp học.',
  },
  {
    icon: Target,
    title: 'Làm quiz rồi xem lại lỗi',
    description:
      'Chấm điểm nhanh, ghi lại câu sai và quay lại đúng phần cần ôn tiếp.',
  },
]

const featuredTopics = [
  {
    title: 'Bắt đầu với bảng chữ cái',
    subtitle: 'Nguyên âm, phụ âm, ghép âm cơ bản',
    sample: '가 · 나 · 다 · 라',
  },
  {
    title: 'Giao tiếp hằng ngày',
    subtitle: 'Chào hỏi, giới thiệu, hỏi đáp ngắn',
    sample: '안녕하세요 · 감사합니다',
  },
  {
    title: 'Từ vựng theo tình huống',
    subtitle: 'Trường học, công việc, đồ ăn, di chuyển',
    sample: '학교 · 회사 · 식당 · 지하철',
  },
]

const reviewPoints = [
  'Tự lưu phiên học gần nhất để quay lại đúng mạch.',
  'Giữ nhịp luyện tập ngắn, đủ cho cả ngày bận.',
  'Gom kết quả theo chủ đề để biết phần nào còn yếu.',
]

function LandingPage() {
  return (
    <div className="landing-page">
      <section className="landing-hero">
        <div className="landing-hero__copy">
          <h1>Học Hangul mỗi ngày theo một nhịp gọn và rõ.</h1>
          <p>
            Daily Hangul gom bài học theo chủ đề, flashcard, quiz và lịch sử ôn
            tập vào một flow đủ ngắn để duy trì đều mỗi ngày.
          </p>

          <div className="action-row landing-actions">
            <Link className="button button-primary" to="/register">
              Tạo tài khoản
              <ArrowRight size={18} />
            </Link>
            <a className="button button-secondary" href="#learning-loop">
              <Play size={18} />
              Xem cách học
            </a>
          </div>

          <dl className="landing-stats">
            <div>
              <dt>Topic-first</dt>
              <dd>Học theo ngữ cảnh thay vì nhồi từ rời.</dd>
            </div>
            <div>
              <dt>Flashcard + Quiz</dt>
              <dd>Nhớ mặt chữ rồi kiểm tra ngay trong cùng một vòng.</dd>
            </div>
            <div>
              <dt>Session history</dt>
              <dd>Biết mình đã học gì và còn sai ở đâu.</dd>
            </div>
          </dl>
        </div>

        <div className="landing-hero__visual" aria-hidden="true">
          <div className="landing-screen">
            <div className="landing-screen__top">
              <div>
                <span className="landing-kicker">Today&apos;s Hangul</span>
                <strong>Lesson 03 · Greeting &amp; Basics</strong>
              </div>
              <span className="landing-status">15 min focus</span>
            </div>

            <div className="landing-screen__body">
              <aside className="landing-screen__topics">
                <span>Foundation</span>
                <span className="active">Daily phrases</span>
                <span>School life</span>
                <span>Travel words</span>
              </aside>

              <div className="landing-screen__lesson">
                <div className="landing-flashcard">
                  <span className="landing-flashcard__label">Flashcard</span>
                  <strong className="hangul-display">안녕하세요</strong>
                  <p>Hello / Hi</p>
                </div>

                <div className="landing-screen__grid">
                  <div className="landing-mini-panel">
                    <span>Quiz gần nhất</span>
                    <strong>8 / 10 đúng</strong>
                    <p>Ôn nhanh ngay sau phiên flashcard.</p>
                  </div>
                  <div className="landing-mini-panel">
                    <span>Từ cần xem lại</span>
                    <strong className="hangul-note">
                      학교 · 감사합니다 · 이름
                    </strong>
                    <p>Được giữ thành một hàng đợi riêng.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="landing-hero__footer">
            <div className="landing-review-card">
              <div className="landing-review-card__header">
                <div>
                  <span className="landing-kicker">Quick review</span>
                  <strong className="hangul-note">학교</strong>
                </div>
                <span className="landing-review-badge">01 / 03</span>
              </div>
              <p className="landing-review-card__meaning">school</p>
              <div className="landing-chip-row">
                <span className="landing-chip">학 · 교</span>
                <span className="landing-chip">school context</span>
              </div>
            </div>

            <div className="landing-hangul-cloud">
              <span>greetings</span>
              <span>school life</span>
              <span>travel</span>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-band" id="learning-loop">
        <div className="landing-section-heading">
          <h2>Một vòng học ngắn, nhưng đủ để tạo phản xạ.</h2>
          <p>
            Landing page này phản ánh đúng luồng học của app: chọn chủ đề, ôn
            flashcard, làm quiz và quay lại câu sai ngay sau đó.
          </p>
        </div>

        <div className="landing-steps">
          {studyLoop.map((item) => {
            const Icon = item.icon

            return (
              <article className="landing-step" key={item.title}>
                <div className="landing-step__icon">
                  <Icon size={20} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="landing-band landing-band--soft" id="topic-library">
        <div className="landing-showcase">
          <div className="landing-showcase__copy">
            <h2>Không chỉ học đẹp mắt, mà còn học đúng thứ cần nhớ.</h2>
            <p>
              Từ phần mở đầu với bảng chữ cái cho đến các cụm giao tiếp thường
              gặp, mỗi chủ đề đều dẫn thẳng sang flashcard và quiz tương ứng.
            </p>

            <div className="landing-bullets">
              {reviewPoints.map((item) => (
                <div className="landing-bullet" key={item}>
                  <CheckCircle2 size={18} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="landing-showcase__panel">
            <div className="landing-panel-shell">
              <div className="landing-panel-shell__header">
                <span>Study rhythm</span>
                <Clock3 size={18} />
              </div>

              <div className="landing-timeline">
                <div>
                  <strong>09:00</strong>
                  <span>Flashcard warm-up · 12 cards</span>
                </div>
                <div>
                  <strong>09:12</strong>
                  <span>Mini quiz · 10 questions</span>
                </div>
                <div>
                  <strong>09:18</strong>
                  <span>Wrong answers review · 3 words</span>
                </div>
              </div>
            </div>

            <div className="landing-panel-shell landing-panel-shell--accent">
              <div className="landing-panel-shell__header">
                <span>Recent wins</span>
                <Sparkles size={18} />
              </div>

              <div className="landing-chip-row">
                <span className="landing-chip landing-chip--solid">Quiz 82%</span>
                <span className="landing-chip">7-day streak</span>
                <span className="landing-chip">12 cards mastered</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-band" id="review-cycle">
        <div className="landing-section-heading">
          <h2>Ba lớp nội dung cốt lõi cho một website học tập rõ ràng.</h2>
          <p>
            Bắt đầu từ những phần nhỏ và đúng ngữ cảnh, sau đó mở rộng dần theo
            nhu cầu học thực tế.
          </p>
        </div>

        <div className="landing-topic-grid">
          {featuredTopics.map((item) => (
            <article className="landing-topic-card" key={item.title}>
              <div className="landing-topic-card__head">
                <NotebookPen size={20} />
                <span>{item.title}</span>
              </div>
              <p>{item.subtitle}</p>
              <strong className="hangul-note">{item.sample}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-cta">
        <div className="landing-cta__copy">
          <h2>Bắt đầu với phiên học đầu tiên thay vì một danh sách dài phải nhớ.</h2>
          <p>
            Tạo tài khoản, vào dashboard và dùng flow flashcard + quiz để kiểm
            tra ngay xem cách học này có hợp với anh không.
          </p>
        </div>

        <div className="action-row">
          <Link className="button button-primary" to="/register">
            Bắt đầu ngay
            <ArrowRight size={18} />
          </Link>
          <Link className="button button-secondary" to="/login">
            <Repeat2 size={18} />
            Tôi đã có tài khoản
          </Link>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
