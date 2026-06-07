const express = require('express')
const {
  getTopic,
  getTopicFlashcards,
  getTopicQuiz,
  getTopics,
} = require('../controllers/topicController')
const { submitTopicQuiz } = require('../controllers/quizResultController')
const { protect } = require('../middlewares/authMiddleware')

const router = express.Router()

router.use(protect)

router.get('/', getTopics)
router.get('/:topicSlug', getTopic)
router.get('/:topicSlug/flashcards', getTopicFlashcards)
router.get('/:topicSlug/quiz', getTopicQuiz)
router.post('/:topicSlug/quiz/submit', submitTopicQuiz)

module.exports = router
