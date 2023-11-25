import express from 'express'
import { getArticles, getArticle, createArticle } from '../controllers/articles.js'

const router = express.Router()

router.post('/',createArticle)

router.get('/page/:page', getArticles)

router.get('/:id', getArticle)

export default router
