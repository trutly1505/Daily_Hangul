const express = require('express')
const {
  getQuizHistory,
  getQuizResult,
} = require('../controllers/quizResultController')
const { protect } = require('../middlewares/authMiddleware')

const router = express.Router()

router.use(protect)

router.get('/', getQuizHistory)
router.get('/:resultId', getQuizResult)

module.exports = router
