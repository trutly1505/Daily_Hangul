import api from './api.js'

async function getTopics() {
  const response = await api.get('/topics')
  return response.data.data
}

async function getTopic(topicSlug) {
  const response = await api.get(`/topics/${topicSlug}`)
  return response.data.data
}

async function getTopicFlashcards(topicSlug) {
  const response = await api.get(`/topics/${topicSlug}/flashcards`)
  return response.data.data
}

async function getTopicQuiz(topicSlug) {
  const response = await api.get(`/topics/${topicSlug}/quiz`)
  return response.data.data
}

export default {
  getTopic,
  getTopicFlashcards,
  getTopicQuiz,
  getTopics,
}
