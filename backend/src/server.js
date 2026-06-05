const app = require('./app')
const connectDatabase = require('./config/db')
const env = require('./config/env')

async function startServer() {
  await connectDatabase()

  const server = app.listen(env.port, () => {
    console.log(`Server listening on port ${env.port}`)
  })

  return server
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('Unable to start server.', error)
    process.exit(1)
  })
}

module.exports = {
  startServer,
}
