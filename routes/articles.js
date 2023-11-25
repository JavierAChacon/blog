import express from 'express'
import { getArticles, getArticle, createArticle, deleteArticle, updateArticle } from '../controllers/articles.js'

const router = express.Router()

router.post('/',createArticle)

router.get('/page/:page', getArticles)

router.route('/:id').get(getArticle).delete(deleteArticle).put(updateArticle)

export default router
