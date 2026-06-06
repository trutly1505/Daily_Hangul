const asyncHandler = require('../utils/asyncHandler')
const {
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

module.exports = {
  getTopic,
  getTopicFlashcards,
  getTopics,
}
