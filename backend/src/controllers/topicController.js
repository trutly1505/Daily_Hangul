const asyncHandler = require('../utils/asyncHandler')
const {
  getQuizByTopicSlug,
  getTopicBySlug,
  listFlashcardsByTopicSlug,
  listTopics,
} = require('../services/topicService')

const getTopics = asyncHandler(async (req, res) => {
  const topics = await listTopics()

  res.status(200).json({
    success: true,
    data: topics,
  })
})

const getTopic = asyncHandler(async (req, res) => {
  const topic = await getTopicBySlug(req.params.topicSlug)

  res.status(200).json({
    success: true,
    data: topic,
  })
})

const getTopicFlashcards = asyncHandler(async (req, res) => {
  const topicFlashcards = await listFlashcardsByTopicSlug(req.params.topicSlug)

  res.status(200).json({
    success: true,
    data: topicFlashcards,
  })
})

const getTopicQuiz = asyncHandler(async (req, res) => {
  const topicQuiz = await getQuizByTopicSlug(req.params.topicSlug)

  res.status(200).json({
    success: true,
    data: topicQuiz,
  })
})

module.exports = {
  getTopic,
  getTopicFlashcards,
  getTopicQuiz,
  getTopics,
}
