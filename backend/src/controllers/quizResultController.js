const asyncHandler = require('../utils/asyncHandler')
const {
  getQuizResultById,
  listQuizHistoryByUser,
  submitQuizResult,
} = require('../services/quizResultService')

const submitTopicQuiz = asyncHandler(async (req, res) => {
  const result = await submitQuizResult({
    topicSlug: req.params.topicSlug,
    userId: req.user.id,
    answers: req.body.answers,
  })

  res.status(201).json({
    success: true,
    data: result,
  })
})

const getQuizResult = asyncHandler(async (req, res) => {
  const result = await getQuizResultById(req.params.resultId, req.user.id)

  res.status(200).json({
    success: true,
    data: result,
  })
})

const getQuizHistory = asyncHandler(async (req, res) => {
  const history = await listQuizHistoryByUser(req.user.id)

  res.status(200).json({
    success: true,
    data: history,
  })
})

module.exports = {
  getQuizHistory,
  getQuizResult,
  submitTopicQuiz,
}
