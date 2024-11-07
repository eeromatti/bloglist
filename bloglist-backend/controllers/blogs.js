const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('../tests/helper')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})


blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  // console.log("body:", body)
  // console.log("request.token:", request.token)

  try {
    const token = request.token  
    // console.log("token löytyy:", token)
    if (!token) {
      return response.status(401).json({ error: 'token missing' })
    }
    
    const decodedToken = jwt.verify(token, process.env.SECRET)
    // console.log("decoded token:", decodedToken)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
  
    const user = await User.findById(decodedToken.id)
    // console.log("user:", user)
    const blog = new Blog({
      author: body.author,
      title: body.title,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)

  } catch (error) {
    next(error)
  }
})


blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const token = request.token
    if (!token) {
      return response.status(401).json({error: 'token missing'})
    }

    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken) {
      return response.status(401).json({error: 'invalid token'})
    }

    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(401).json({error: 'blog missing'})
    }
    
    if (blog.user.toString() === decodedToken.id) {
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()  
    }
  
  } catch (error) {
    console.error("Error during blog deletion", error)
    next(error)
  }
})


blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user._id
  }

  try {
  updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)

  } catch(error) {
    next(error)
  }
})
  
  
module.exports = blogsRouter