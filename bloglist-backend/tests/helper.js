const Blog = require('../models/blog')
const User = require('../models/user')


// const nonExistingId = async () => {
//   const blog = new Blog({ content: 'willremovethissoon' })
//   await note.save()
//   await note.deleteOne()

//   return note._id.toString()
// }

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  blogsInDb,
  usersInDb,
}