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

  const previewFlashcard = await Flashcard.findOne({
    topic: topic._id,
    isPublished: true,
  }).sort({ order: 1 })

  return sanitizeTopic(topic, previewFlashcard)
}

async function listFlashcardsByTopicSlug(topicSlug) {
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

  const flashcards = await Flashcard.find({
    topic: topic._id,
    isPublished: true,
  }).sort({ order: 1 })

  return {
    topic: sanitizeTopic(topic),
    flashcards: flashcards.map(sanitizeFlashcard),
  }
}

module.exports = {
  getTopicBySlug,
  listFlashcardsByTopicSlug,
  listTopics,
}
