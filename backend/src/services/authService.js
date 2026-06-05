const User = require('../models/User')
const createHttpError = require('../utils/createHttpError')
const generateToken = require('../utils/generateToken')

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function sanitizeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

function validateRegisterPayload(payload) {
  const name = payload.name?.trim()
  const email = payload.email?.trim().toLowerCase()
  const password = payload.password ?? ''

  if (!name) {
    throw createHttpError(400, 'Name is required.')
  }

  if (!email) {
    throw createHttpError(400, 'Email is required.')
  }

  if (!emailPattern.test(email)) {
    throw createHttpError(400, 'Email format is invalid.')
  }

  if (!password) {
    throw createHttpError(400, 'Password is required.')
  }

  if (password.length < 6) {
    throw createHttpError(400, 'Password must be at least 6 characters.')
  }

  return {
    name,
    email,
    password,
  }
}

function validateLoginPayload(payload) {
  const email = payload.email?.trim().toLowerCase()
  const password = payload.password ?? ''

  if (!email) {
    throw createHttpError(400, 'Email is required.')
  }

  if (!emailPattern.test(email)) {
    throw createHttpError(400, 'Email format is invalid.')
  }

  if (!password) {
    throw createHttpError(400, 'Password is required.')
  }

  return {
    email,
    password,
  }
}

async function registerUser(payload) {
  const { name, email, password } = validateRegisterPayload(payload)

  const existingUser = await User.findOne({ email })

  if (existingUser) {
    throw createHttpError(409, 'Email is already in use.')
  }

  const user = await User.create({
    name,
    email,
    password,
  })

  return {
    user: sanitizeUser(user),
    token: generateToken({
      id: user._id.toString(),
      email: user.email,
    }),
  }
}

async function loginUser(payload) {
  const { email, password } = validateLoginPayload(payload)

  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    throw createHttpError(401, 'Invalid email or password.')
  }

  const isPasswordValid = await user.comparePassword(password)

  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid email or password.')
  }

  return {
    user: sanitizeUser(user),
    token: generateToken({
      id: user._id.toString(),
      email: user.email,
    }),
  }
}

module.exports = {
  loginUser,
  registerUser,
  sanitizeUser,
}
