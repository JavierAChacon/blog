import Article from '../models/Article.js'

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
    }

    if (content.length < 50) {
      return res
        .status(400)
        .json({ error: 'The content must have at least 50 characters' })
    }

    if (title.length > 50) {
      return res
        .status(400)
        .json({ error: 'The title must not exceed 50 characters' })
    }

    await new Article(req.body).save()

    return res.status(201).json({
      msg: 'Article created successfully',
      article: req.body
    })
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
    }

    return res.status(202).json({
      msg: 'Article deleted successfully',
      article: deletedArticle
    })
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
    }

    await Article.findByIdAndUpdate(id, req.body)
    return res.json({
      msg: "Article updated successfully",
      article: req.body
    })
  } catch (error) {
    return res.json({
      error: error.message
    })
  }
}

export { getArticles, getArticle, createArticle, deleteArticle, updateArticle }
