import mongoose, {Schema, model} from 'mongoose'

const articleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content : {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  image: {
    type: String,
    default: "default.png"
  }
})

const Article = mongoose.model('Article', articleSchema)

export default Article
