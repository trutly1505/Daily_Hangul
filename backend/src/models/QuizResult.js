const mongoose = require('mongoose')

const quizAnswerSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      min: 1,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    prompt: {
      type: String,
      required: true,
      trim: true,
    },
    supportText: {
      type: String,
      default: '',
      trim: true,
    },
    selectedOptionId: {
      type: String,
      required: true,
      trim: true,
    },
    selectedOptionLabel: {
      type: String,
      required: true,
      trim: true,
    },
    correctOptionId: {
      type: String,
      required: true,
      trim: true,
    },
    correctOptionLabel: {
      type: String,
      required: true,
      trim: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
    correctAnswer: {
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
    },
  },
  {
    _id: false,
  },
)

const quizResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
      index: true,
    },
    topicSlug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    topicTitle: {
      type: String,
      required: true,
      trim: true,
    },
    scorePercent: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    correctCount: {
      type: Number,
      required: true,
      min: 0,
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 0,
    },
    answers: {
      type: [quizAnswerSchema],
      default: [],
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

quizResultSchema.index({ user: 1, submittedAt: -1 })
quizResultSchema.index({ user: 1, topic: 1, submittedAt: -1 })

module.exports = mongoose.model('QuizResult', quizResultSchema)
