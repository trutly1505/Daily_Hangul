const mongoose = require('mongoose')

const flashcardSchema = new mongoose.Schema(
  {
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
      index: true,
    },
    sourceId: {
      type: Number,
      required: true,
      min: 1,
    },
    order: {
      type: Number,
      required: true,
      min: 1,
    },
    level: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    word: {
      type: String,
      required: true,
      trim: true,
    },
    meaningVi: {
      type: String,
      required: true,
      trim: true,
    },
    pronunciation: {
      type: String,
      default: '',
      trim: true,
    },
    exampleKo: {
      type: String,
      default: '',
      trim: true,
    },
    exampleVi: {
      type: String,
      default: '',
      trim: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

flashcardSchema.index({ topic: 1, sourceId: 1 }, { unique: true })
flashcardSchema.index({ topic: 1, order: 1 }, { unique: true })

module.exports = mongoose.model('Flashcard', flashcardSchema)
