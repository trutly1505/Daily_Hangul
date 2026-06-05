const env = require('../config/env')

function notFoundHandler(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`)
  error.statusCode = 404
  next(error)
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error)
  }

  const statusCode = error.statusCode || 500
  const response = {
    success: false,
    message: error.message || 'Internal server error',
  }

  if (env.nodeEnv !== 'production') {
    response.stack = error.stack
  }

  res.status(statusCode).json(response)
}

module.exports = {
  notFoundHandler,
  errorHandler,
}
