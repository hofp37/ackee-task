import { createServer } from 'unicore'
import logger from './app/logger'
import bindRoutes from './config/routes'
import connectDB from './config/db'

// Connect to MongoDB
void connectDB()

const server = createServer()
server.use(logger.express)
bindRoutes(server)

export default server
