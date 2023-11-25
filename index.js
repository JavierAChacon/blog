import express from 'express'
import cors from 'cors'
import { connection } from './database/connection.js'
import articlesRoutes from './routes/articles.js'

connection()

const app = express()
const PORT = 3000

// app.use(cors)

app.use(express.json())

app.use('/api/articles', articlesRoutes)

app.listen(PORT, () => {
  console.log('Server running on port: '+ PORT)
})
