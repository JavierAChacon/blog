import express from 'express'
import multer from 'multer'
import {
  getArticles,
  getArticle,
  createArticle,
  deleteArticle,
  updateArticle,
  getImage,
  uploadImage,
  searcher
} from '../controllers/articles.js'

const router = express.Router()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images/articles')
  },

  filename: function (req, file, cb) {
    cb(null, 'article' + Date.now() + file.originalname)
  }
})

const uploads = multer({ storage })

router.post('/', createArticle)

router.get('/page/:page', getArticles)

router
  .route('/:id')
  .get(getArticle)
  .delete(deleteArticle)
  .put(updateArticle)
  .post(uploads.single('file0'), uploadImage)

router.get('/image/:id', getImage)

router.get('/search/:search', searcher)

export default router
