const cors = require('cors')
const express = require('express')
const env = require('./config/env')
const {
  errorHandler,
  notFoundHandler,
} = require('./middlewares/errorMiddleware')
const authRoutes = require('./routes/authRoutes')
const healthRoutes = require('./routes/healthRoutes')

const app = express()
const allowedOrigins = new Set(env.clientUrls)

app.disable('x-powered-by')

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true)
        return
      }

      callback(new Error(`Origin ${origin} not allowed by CORS`))
    },
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      name: 'Daily Hangul API',
      status: 'ready',
    },
  })
})

app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      name: 'Daily Hangul API',
      version: 'v1',
    },
  })
})

app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

module.exports = app
