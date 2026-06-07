const Flashcard = require('../models/Flashcard')
const Topic = require('../models/Topic')
const createHttpError = require('../utils/createHttpError')

function sanitizeTopic(topic, previewFlashcard = null) {
  return {
    id: topic._id.toString(),
    slug: topic.slug,
    title: topic.title,
    description: topic.description,
    level: topic.level,
    wordCount: topic.wordCount,
    quizQuestionCount: topic.quizQuestionCount,
    sortOrder: topic.sortOrder,
    isPublished: topic.isPublished,
    previewWord: previewFlashcard?.word || null,
    previewMeaningVi: previewFlashcard?.meaningVi || null,
    previewPronunciation: previewFlashcard?.pronunciation || null,
  }
}

function sanitizeFlashcard(flashcard) {
  return {
    id: flashcard._id.toString(),
    sourceId: flashcard.sourceId,
    order: flashcard.order,
    level: flashcard.level,
    word: flashcard.word,
    meaningVi: flashcard.meaningVi,
    pronunciation: flashcard.pronunciation,
    exampleKo: flashcard.exampleKo,
    exampleVi: flashcard.exampleVi,
  }
}

function sanitizeQuizQuestion(question) {
  return {
    id: question.id,
    order: question.order,
    type: question.type,
    prompt: question.prompt,
    supportText: question.supportText,
    options: question.options.map((option) => ({
      id: option.id,
      label: option.label,
      subtitle: option.subtitle,
    })),
    totalQuestions: question.totalQuestions,
  }
}

function buildQuizOption(card, type, isCorrect) {
  return {
    id: `${type}-${card._id.toString()}`,
    label: type === 'word_to_meaning' ? card.meaningVi : card.word,
    subtitle: type === 'meaning_to_word' ? card.pronunciation : '',
    isCorrect,
  }
}

function buildQuizQuestion(flashcards, flashcard, index, questionCount) {
  const type = index % 2 === 0 ? 'word_to_meaning' : 'meaning_to_word'
  const distractors = []
  let offset = 1

  while (distractors.length < Math.min(3, flashcards.length - 1)) {
    const candidate = flashcards[(index + offset) % flashcards.length]

    if (
      candidate &&
      candidate._id.toString() !== flashcard._id.toString() &&
      !distractors.some((item) => item._id.toString() === candidate._id.toString())
    ) {
      distractors.push(candidate)
    }

    offset += 1
  }

  const options = distractors.map((card) => buildQuizOption(card, type, false))
  const insertionIndex = index % (options.length + 1)

  options.splice(insertionIndex, 0, buildQuizOption(flashcard, type, true))

  const correctOption = options.find((option) => option.isCorrect)

  return {
    id: `question-${flashcard._id.toString()}`,
    order: index + 1,
    type,
    prompt:
      type === 'word_to_meaning'
        ? flashcard.word
        : `Từ Hangul nào có nghĩa "${flashcard.meaningVi}"?`,
    supportText:
      type === 'word_to_meaning'
        ? flashcard.pronunciation || flashcard.exampleKo || ''
        : flashcard.exampleVi || '',
    options,
    correctOptionId: correctOption?.id || '',
    correctAnswer: {
      word: flashcard.word,
      meaningVi: flashcard.meaningVi,
      pronunciation: flashcard.pronunciation,
      exampleKo: flashcard.exampleKo,
      exampleVi: flashcard.exampleVi,
    },
    totalQuestions: questionCount,
  }
}

async function findTopicOrThrow(topicSlug) {
  const slug = topicSlug?.trim().toLowerCase()

  if (!slug) {
    throw createHttpError(400, 'Topic slug is required.')
  }

  const topic = await Topic.findOne({
    slug,
    isPublished: true,
  })

  if (!topic) {
    throw createHttpError(404, 'Topic not found.')
  }

  return topic
}

async function findPublishedFlashcardsByTopic(topicId) {
  return Flashcard.find({
    topic: topicId,
    isPublished: true,
  }).sort({ order: 1 })
}

async function buildQuizByTopicSlug(topicSlug) {
  const topic = await findTopicOrThrow(topicSlug)
  const flashcards = await findPublishedFlashcardsByTopic(topic._id)

  if (!flashcards.length) {
    throw createHttpError(404, 'Topic does not have enough flashcards for a quiz.')
  }

  const questionCount = Math.min(topic.quizQuestionCount || 10, flashcards.length)
  const selectedFlashcards = flashcards.slice(0, questionCount)

  return {
    topic,
    serializedTopic: sanitizeTopic(topic),
    questions: selectedFlashcards.map((flashcard, index) =>
      buildQuizQuestion(flashcards, flashcard, index, questionCount),
    ),
  }
}

async function listTopics() {
  const topics = await Topic.find({ isPublished: true }).sort({
    sortOrder: 1,
    title: 1,
  })

  const serializedTopics = await Promise.all(
    topics.map(async (topic) => {
      const previewFlashcard = await Flashcard.findOne({
        topic: topic._id,
        isPublished: true,
      }).sort({ order: 1 })

      return sanitizeTopic(topic, previewFlashcard)
    }),
  )

  return serializedTopics
}

async function getTopicBySlug(topicSlug) {
  const topic = await findTopicOrThrow(topicSlug)

  const previewFlashcard = await Flashcard.findOne({
    topic: topic._id,
    isPublished: true,
  }).sort({ order: 1 })

  return sanitizeTopic(topic, previewFlashcard)
}

async function listFlashcardsByTopicSlug(topicSlug) {
  const topic = await findTopicOrThrow(topicSlug)
  const flashcards = await findPublishedFlashcardsByTopic(topic._id)

  return {
    topic: sanitizeTopic(topic),
    flashcards: flashcards.map(sanitizeFlashcard),
  }
}

async function getQuizByTopicSlug(topicSlug) {
  const quiz = await buildQuizByTopicSlug(topicSlug)

  return {
    topic: quiz.serializedTopic,
    questions: quiz.questions.map(sanitizeQuizQuestion),
  }
}

module.exports = {
  buildQuizByTopicSlug,
  getQuizByTopicSlug,
  getTopicBySlug,
  listFlashcardsByTopicSlug,
  listTopics,
}
