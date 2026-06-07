const mongoose = require('mongoose')
const QuizResult = require('../models/QuizResult')
const createHttpError = require('../utils/createHttpError')
const { buildQuizByTopicSlug } = require('./topicService')

function formatQuizResult(result) {
  const answers = result.answers.map((answer) => ({
    questionId: answer.questionId,
    order: answer.order,
    type: answer.type,
    prompt: answer.prompt,
    supportText: answer.supportText,
    selectedOptionId: answer.selectedOptionId,
    selectedOptionLabel: answer.selectedOptionLabel,
    correctOptionId: answer.correctOptionId,
    correctOptionLabel: answer.correctOptionLabel,
    isCorrect: answer.isCorrect,
    correctAnswer: {
      word: answer.correctAnswer.word,
      meaningVi: answer.correctAnswer.meaningVi,
      pronunciation: answer.correctAnswer.pronunciation,
      exampleKo: answer.correctAnswer.exampleKo,
      exampleVi: answer.correctAnswer.exampleVi,
    },
  }))

  const wrongAnswers = answers.filter((answer) => !answer.isCorrect)

  return {
    id: result._id.toString(),
    topic: {
      id: result.topic.toString(),
      slug: result.topicSlug,
      title: result.topicTitle,
    },
    scorePercent: result.scorePercent,
    correctCount: result.correctCount,
    totalQuestions: result.totalQuestions,
    wrongCount: result.totalQuestions - result.correctCount,
    submittedAt: result.submittedAt.toISOString(),
    scoreLabel: `${result.correctCount}/${result.totalQuestions}`,
    answers,
    wrongAnswers,
  }
}

function formatQuizResultSummary(result) {
  return {
    id: result._id.toString(),
    topic: {
      id: result.topic.toString(),
      slug: result.topicSlug,
      title: result.topicTitle,
    },
    scorePercent: result.scorePercent,
    correctCount: result.correctCount,
    totalQuestions: result.totalQuestions,
    wrongCount: result.totalQuestions - result.correctCount,
    submittedAt: result.submittedAt.toISOString(),
    scoreLabel: `${result.correctCount}/${result.totalQuestions}`,
  }
}

function normalizeSubmittedAnswers(answers) {
  if (!Array.isArray(answers) || !answers.length) {
    throw createHttpError(400, 'Quiz answers are required.')
  }

  return answers
    .map((answer) => ({
      questionId: answer?.questionId?.trim?.() || '',
      selectedOptionId: answer?.selectedOptionId?.trim?.() || '',
    }))
    .filter((answer) => answer.questionId && answer.selectedOptionId)
}

async function submitQuizResult({ topicSlug, userId, answers }) {
  const normalizedAnswers = normalizeSubmittedAnswers(answers)
  const quiz = await buildQuizByTopicSlug(topicSlug)
  const answerMap = new Map(normalizedAnswers.map((answer) => [answer.questionId, answer]))

  const missingAnswer = quiz.questions.find((question) => !answerMap.has(question.id))

  if (missingAnswer) {
    throw createHttpError(400, 'All quiz questions must be answered before submission.')
  }

  const persistedAnswers = quiz.questions.map((question) => {
    const submittedAnswer = answerMap.get(question.id)
    const selectedOption = question.options.find(
      (option) => option.id === submittedAnswer.selectedOptionId,
    )
    const correctOption = question.options.find(
      (option) => option.id === question.correctOptionId,
    )

    if (!selectedOption || !correctOption) {
      throw createHttpError(400, 'Submitted quiz answers are invalid.')
    }

    return {
      questionId: question.id,
      order: question.order,
      type: question.type,
      prompt: question.prompt,
      supportText: question.supportText,
      selectedOptionId: selectedOption.id,
      selectedOptionLabel: selectedOption.label,
      correctOptionId: correctOption.id,
      correctOptionLabel: correctOption.label,
      isCorrect: selectedOption.id === correctOption.id,
      correctAnswer: question.correctAnswer,
    }
  })

  const correctCount = persistedAnswers.filter((answer) => answer.isCorrect).length
  const totalQuestions = persistedAnswers.length
  const scorePercent = totalQuestions
    ? Math.round((correctCount / totalQuestions) * 100)
    : 0

  const result = await QuizResult.create({
    user: userId,
    topic: quiz.topic._id,
    topicSlug: quiz.topic.slug,
    topicTitle: quiz.topic.title,
    scorePercent,
    correctCount,
    totalQuestions,
    answers: persistedAnswers,
  })

  return formatQuizResult(result)
}

async function getQuizResultById(resultId, userId) {
  if (!mongoose.Types.ObjectId.isValid(resultId)) {
    throw createHttpError(400, 'Quiz result id is invalid.')
  }

  const result = await QuizResult.findOne({
    _id: resultId,
    user: userId,
  })

  if (!result) {
    throw createHttpError(404, 'Quiz result not found.')
  }

  return formatQuizResult(result)
}

async function listQuizHistoryByUser(userId) {
  const results = await QuizResult.find({ user: userId }).sort({
    submittedAt: -1,
    _id: -1,
  })

  return results.map(formatQuizResultSummary)
}

module.exports = {
  getQuizResultById,
  listQuizHistoryByUser,
  submitQuizResult,
}
