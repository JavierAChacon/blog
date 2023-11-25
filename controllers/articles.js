import Article from '../models/Article.js'

const getArticles = async (req, res) => {
  try {
    const articles = await Article.find()
      .select('title content')
      .sort({ date: -1 })
      .skip((req.params.page - 1) * 3)
      .limit(3)

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

    const article = new Article(req.body)

    await article.save()

    return res.status(201).json({
      msg: 'Article created successfully',
      article
    })
  } catch (error) {
    return res.json({
      error: error.message
    })
  }
}

export { getArticles, getArticle, createArticle }
