const mongoose = require('mongoose')
const connectDatabase = require('../config/db')
const Topic = require('../models/Topic')
const Flashcard = require('../models/Flashcard')
const {
  topics,
  flashcards,
} = require('./data/vocabularySeedData')

async function syncTopics() {
  const topicMap = new Map()
  const upsertOptions = {
    upsert: true,
    runValidators: true,
    setDefaultsOnInsert: true,
    returnDocument: 'after',
  }

  for (const topicSeed of topics) {
    const topic = await Topic.findOneAndUpdate(
      { slug: topicSeed.slug },
      topicSeed,
      upsertOptions,
    )

    topicMap.set(topic.slug, topic)
  }

  return topicMap
}

async function syncFlashcards(topicMap) {
  const upsertOptions = {
    upsert: true,
    runValidators: true,
    setDefaultsOnInsert: true,
    returnDocument: 'after',
  }
  const flashcardsByTopic = flashcards.reduce((groups, flashcard) => {
    if (!groups[flashcard.topicSlug]) {
      groups[flashcard.topicSlug] = []
    }

    groups[flashcard.topicSlug].push(flashcard)
    return groups
  }, {})

  let totalUpserts = 0

  for (const [slug, topicFlashcards] of Object.entries(flashcardsByTopic)) {
    const topic = topicMap.get(slug)

    if (!topic) {
      throw new Error(`Topic not found for flashcards: ${slug}`)
    }

    const allowedSourceIds = topicFlashcards.map((item) => item.sourceId)

    await Flashcard.deleteMany({
      topic: topic._id,
      sourceId: { $nin: allowedSourceIds },
    })

    for (const flashcardSeed of topicFlashcards) {
      const { topicSlug, ...payload } = flashcardSeed
      void topicSlug

      await Flashcard.findOneAndUpdate(
        {
          topic: topic._id,
          sourceId: flashcardSeed.sourceId,
        },
        {
          ...payload,
          topic: topic._id,
        },
        upsertOptions,
      )

      totalUpserts += 1
    }

    const wordCount = await Flashcard.countDocuments({ topic: topic._id })

    await Topic.updateOne(
      { _id: topic._id },
      {
        $set: {
          wordCount,
        },
      },
    )
  }

  return totalUpserts
}

async function seedVocabulary() {
  await connectDatabase()

  const topicMap = await syncTopics()
  const totalFlashcards = await syncFlashcards(topicMap)

  console.log(
    `Vocabulary seed completed: ${topicMap.size} topics, ${totalFlashcards} flashcards synced.`,
  )
}

if (require.main === module) {
  seedVocabulary()
    .then(async () => {
      await mongoose.disconnect()
      process.exit(0)
    })
    .catch(async (error) => {
      console.error('Vocabulary seed failed.', error)
      await mongoose.disconnect()
      process.exit(1)
    })
}

module.exports = seedVocabulary
