const Blog = require('../models/blog')

const initialBlogs = [
  {
    _id: "6718e7a64d2f893486d9d887",
    title: "Penan parhaat",
    author: "Pena",
    url: "pena.fi/parhaat",
    likes: 3,
  },
  {
    _id: "6718e7b18c8017aa9ca7a02a",
    title: "Jaren keskinkertaiset",
    author: "Jare",
    url: "jare.fi/ok",
    likes: 4
  }
]

const dummy = (blogs) => {
  return 1
}

const likes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum+blog.likes
  }
  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce((max, blog) => {
    return blog.likes > max.likes ? blog : max
  }, blogs[0])  
  return favorite
}

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  console.log(blogs)
  return blogs.map(blog => blog.toJSON())
}



module.exports = {
  dummy, likes, favoriteBlog, nonExistingId, blogsInDb
}



