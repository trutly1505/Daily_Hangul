const { loginUser, registerUser, sanitizeUser } = require('../services/authService')
const asyncHandler = require('../utils/asyncHandler')

const register = asyncHandler(async (req, res) => {
  const authPayload = await registerUser(req.body)

  res.status(201).json({
    success: true,
    data: authPayload,
  })
})

const login = asyncHandler(async (req, res) => {
  const authPayload = await loginUser(req.body)

  res.status(200).json({
    success: true,
    data: authPayload,
  })
})

const me = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: sanitizeUser(req.user),
  })
})

module.exports = {
  login,
  me,
  register,
}
