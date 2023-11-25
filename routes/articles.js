import express from 'express'
import { getArticles, getArticle, createArticle, deleteArticle } from '../controllers/articles.js'

const router = express.Router()

router.post('/',createArticle)

router.get('/page/:page', getArticles)

router.route('/:id').get(getArticle).delete(deleteArticle)

export default router
