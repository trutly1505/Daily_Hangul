const path = require('path')
const dotenv = require('dotenv')

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
})

const rawClientUrls = process.env.CLIENT_URL || 'http://localhost:5173'
const clientUrls = rawClientUrls
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean)

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri:
    process.env.MONGO_URI || 'mongodb://localhost:27017/daily_hangul',
  jwtSecret: process.env.JWT_SECRET || 'change_this_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: clientUrls[0] || 'http://localhost:5173',
  clientUrls,
}

module.exports = env
