const jwt = require('jsonwebtoken')
const env = require('../config/env')
const User = require('../models/User')
const asyncHandler = require('../utils/asyncHandler')
const createHttpError = require('../utils/createHttpError')

const protect = asyncHandler(async (req, res, next) => {
  const authorizationHeader = req.headers.authorization || ''

  if (!authorizationHeader.startsWith('Bearer ')) {
    throw createHttpError(401, 'Authorization token is required.')
  }

  const token = authorizationHeader.slice(7).trim()

  if (!token) {
    throw createHttpError(401, 'Authorization token is required.')
  }

  let decodedToken

  try {
    decodedToken = jwt.verify(token, env.jwtSecret)
  } catch (error) {
    void error
    throw createHttpError(401, 'Authorization token is invalid or expired.')
  }

  const user = await User.findById(decodedToken.id)

  if (!user) {
    throw createHttpError(401, 'The user for this token no longer exists.')
  }

  req.user = user
  next()
})

module.exports = {
  protect,
}
