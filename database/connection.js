import mongoose from 'mongoose'

const connection = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/blog')
    console.log('Connected to database')
  } catch (error) {
    console.log(error)
    throw new Error('Failed to connect to the database')
  }
}

export {
  connection
}
