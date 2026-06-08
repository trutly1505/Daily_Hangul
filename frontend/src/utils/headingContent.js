const topicTitleMap = {
  school: {
    vi: 'Trường học',
    ko: '학교',
  },
  food: {
    vi: 'Đồ ăn',
    ko: '음식',
  },
}

const headingMap = {
  landingHeroTitle: {
    vi: 'Học Hangul mỗi ngày theo một nhịp gọn và rõ.',
    ko: '매일 또렷한 흐름으로 한글을 배워보세요.',
  },
  landingLoopTitle: {
    vi: 'Một vòng học ngắn, nhưng đủ để tạo phản xạ.',
    ko: '짧지만 반응을 만드는 학습 루프',
  },
  landingShowcaseTitle: {
    vi: 'Không chỉ học đẹp mắt, mà còn học đúng thứ cần nhớ.',
    ko: '보기 좋을 뿐 아니라 꼭 기억할 것을 제대로 배웁니다.',
  },
  landingCoreTitle: {
    vi: 'Ba lớp nội dung cốt lõi cho một website học tập rõ ràng.',
    ko: '학습 웹사이트에 필요한 세 가지 핵심 콘텐츠',
  },
  landingCtaTitle: {
    vi: 'Bắt đầu với phiên học đầu tiên thay vì một danh sách dài phải nhớ.',
    ko: '긴 목록보다 첫 학습 세션부터 시작하세요.',
  },
  dashboardHeroTitle: {
    vi: ({ name }) => `${name}, bắt đầu với các topic đã sẵn sàng để học.`,
    ko: ({ name }) => `${name}, 바로 학습할 수 있는 주제로 시작해보세요.`,
  },
  dashboardTopicsTitle: {
    vi: 'Các chủ đề đang có',
    ko: '학습 가능한 주제',
  },
  authLoadingTitle: {
    vi: 'Đang kiểm tra phiên đã lưu',
    ko: '저장된 세션 확인 중',
  },
  loginTitle: {
    vi: 'Đăng nhập',
    ko: '로그인',
  },
  registerTitle: {
    vi: 'Tạo tài khoản',
    ko: '회원가입',
  },
  historyTitle: {
    vi: 'Lịch sử các lượt làm quiz đã lưu.',
    ko: '저장된 퀴즈 기록',
  },
  flashcardSummaryTitle: {
    vi: ({ topicTitle }) => `Đã học xong bộ thẻ của ${topicTitle}.`,
    ko: ({ topicTitle }) => `${topicTitle} 플래시카드 학습을 마쳤습니다.`,
  },
  quizResultTitle: {
    vi: ({ topicTitle, scoreLabel }) => `${topicTitle}: ${scoreLabel} câu đúng.`,
    ko: ({ topicTitle, scoreLabel }) => `${topicTitle}: ${scoreLabel} 정답입니다.`,
  },
  reviewTitle: {
    vi: ({ topicTitle, totalQuestions }) =>
      `${topicTitle}: xem lại ${totalQuestions} câu đã làm.`,
    ko: ({ topicTitle, totalQuestions }) => `${topicTitle}: ${totalQuestions}개 문항 다시 보기.`,
  },
}

export function getTopicDisplayTitle(topic, uiLanguage = 'vi') {
  const slug =
    typeof topic === 'string'
      ? topic
      : topic?.slug || topic?.topic?.slug || topic?.id || ''

  const mappedTitle = topicTitleMap[slug]?.[uiLanguage]

  if (mappedTitle) {
    return mappedTitle
  }

  if (typeof topic === 'object') {
    return topic?.title || slug
  }

  return slug
}

export function getHeadingText(key, uiLanguage = 'vi', params = {}) {
  const entry = headingMap[key]

  if (!entry) {
    return ''
  }

  const localizedValue = entry[uiLanguage] ?? entry.vi

  return typeof localizedValue === 'function'
    ? localizedValue(params)
    : localizedValue
}

