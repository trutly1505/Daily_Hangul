import api from './api.js'

async function getTopicQuiz(topicSlug) {
  const response = await api.get(`/topics/${topicSlug}/quiz`)
  return response.data.data
}

async function submitTopicQuiz(topicSlug, answers) {
  const response = await api.post(`/topics/${topicSlug}/quiz/submit`, {
    answers,
  })
  return response.data.data
}

async function getQuizResult(resultId) {
  const response = await api.get(`/quiz-results/${resultId}`)
  return response.data.data
}

async function getQuizHistory() {
  const response = await api.get('/quiz-results')
  return response.data.data
}

export default {
  getTopicQuiz,
  getQuizHistory,
  getQuizResult,
  submitTopicQuiz,
}
