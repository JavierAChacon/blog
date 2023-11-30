import { error } from 'console'
import Article from '../models/Article.js'
import fs from 'fs'
import path from 'path'

const getArticles = async (req, res) => {
  try {
    const limit = 3
    const { page } = req.params

    const articles = await Article.find()
      .select('title content')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    if (page > Math.ceil(articles / limit)) {
      return res.status(404).json({
        error: "Page not found. Looks like you're lost"
      })
    }

    if (!articles) {
      return res.status(404).json({
        msg: 'There are not articles yet'
      })
    }

    return res.json(articles)
  } catch (error) {
    return res.json({
      error: error.message
    })
  }
}

const getArticle = async (req, res) => {
  const { id } = req.params
  try {
    const article = await Article.findById(id)
    return res.json(article)
  } catch (error) {
    return res.json({
      error: error.message
    })
  }
}

const createArticle = async (req, res) => {
  try {
    const { title, content } = req.body

    Object.keys(req.body).map(key => (req.body[key] = req.body[key].trim()))

    if (Object.values(req.body).includes('')) {
      return res.status(400).json({ error: 'All the fields are required' })
    } else if (content.length < 50) {
      return res
        .status(400)
        .json({ error: 'The content must have at least 50 characters' })
    } else if (title.length > 50) {
      return res
        .status(400)
        .json({ error: 'The title must not exceed 50 characters' })
    } else {
      await new Article(req.body).save()

      return res.status(201).json({
        msg: 'Article created successfully',
        article: req.body
      })
    }
  } catch (error) {
    return res.json({
      error: error.message
    })
  }
}

const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params
    const deletedArticle = await Article.findByIdAndDelete(id)

    if (!deletedArticle) {
      return res.status(404).json({
        error: 'Article not found'
      })
    } else {
      return res.status(202).json({
        msg: 'Article deleted successfully',
        article: deletedArticle
      })
    }
  } catch (error) {
    return res.json({
      error: error.message
    })
  }
}

const updateArticle = async (req, res) => {
  try {
    const { id } = req.params

    Object.keys(req.body).map(key => (req.body[key] = req.body[key].trim()))

    if (Object.values(req.body).includes('')) {
      return res.status(400).json({ error: 'All the fields are required' })
    } else {
      await Article.findByIdAndUpdate(id, req.body)
      return res.json({
        msg: 'Article updated successfully',
        article: req.body
      })
    }
  } catch (error) {
    return res.json({
      error: error.message
    })
  }
}

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      res.status(404).json({ error: 'Invalid request' })
    } else if (
      !['png', 'jpg', 'jpeg'].includes(req.file.originalname.split('.')[1])
    ) {
      fs.unlink(req.file.path, error =>
        res.status(400).json({ error: 'Extension invalid' })
      )
    } else {
      const { id } = req.params
      const articleUpdated = await Article.findByIdAndUpdate(id, {
        image: req.file.filename
      })
      console.log(articleUpdated)
      return res.json({
        msg: 'uploading image',
        file: {
          name: req.file.filename,
          extension: req.file.originalname.split('.')[1],
          originalName: req.file.originalname
        }
      })
    }
  } catch (error) {
    return res.json({ error: error.message })
  }
}

const getImage = async (req, res) => {
  const file = req.params.id
  const pathStorage = './images/articles/' + file

  fs.stat(pathStorage, (error, isExists) => {
    if (isExists) {
      return res.sendFile(path.resolve(pathStorage))
    } else {
      return res.status(404).json({
        error: error.message
      })
    }
  })
}

const searcher = async (req, res) => {
  try {
    const search = req.params.search
    const result = await Article.find({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]
    }).sort({
      date: -1
    })
    if (!result.length) {
      return res.status(404).json({
        error: 'Articles not found'
      })
    }
    return res.json({
      result
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

export {
  getArticles,
  getArticle,
  createArticle,
  deleteArticle,
  updateArticle,
  getImage,
  uploadImage,
  searcher
}
