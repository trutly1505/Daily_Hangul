const mongoose = require('mongoose')

const topicSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    wordCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    quizQuestionCount: {
      type: Number,
      default: 10,
      min: 0,
    },
    sortOrder: {
      type: Number,
      default: 0,
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

module.exports = mongoose.model('Topic', topicSchema)
