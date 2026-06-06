const express = require('express')
const {
  getTopic,
  getTopicFlashcards,
  getTopics,
} = require('../controllers/topicController')
const { protect } = require('../middlewares/authMiddleware')

const router = express.Router()

router.use(protect)

router.get('/', getTopics)
router.get('/:topicSlug', getTopic)
router.get('/:topicSlug/flashcards', getTopicFlashcards)

module.exports = router
