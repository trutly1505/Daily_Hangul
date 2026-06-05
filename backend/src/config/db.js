const mongoose = require('mongoose')
const env = require('./env')

async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection
  }

  const connection = await mongoose.connect(env.mongoUri)

  console.log(`MongoDB connected: ${connection.connection.host}`)

  return connection
}

module.exports = connectDatabase
