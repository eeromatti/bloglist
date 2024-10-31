const { test, after, describe, beforeEach } = require('node:test')
const Blog = require('../models/blog')
const User = require('../models/user')

const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('assert')
const app = require('../app')
// const listHelper = require('../utils/list_helper')
const blogRoutes = require('../controllers/blogs')
const middleware = require('../utils/middleware')
const helper = require('./helper')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const api = supertest(app)


// beforeEach(async () => {
//   await Blog.deleteMany({})
//   await Blog.insertMany(listHelper.initialBlogs)
// })

// test('dummy returns one', () => {
//   const blogs = []
//   const result = listHelper.dummy(blogs)
//   assert.strictEqual(result, 1)
// })

// test('return total likes', () => {
//   const result = listHelper.likes(blogs)
//   assert.strictEqual(result, 12)
// })

// describe('favorite', () => {
//   test.only('return max likes', () => {
//     const result = listHelper.favoriteBlog(blogs)
//     assert.strictEqual(result, blogs[0])
//   })
// })


describe('number and type', () => {
  test('blogs are returned as json', async () => {
    const allBlogs = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.deepStrictEqual(allBlogs.body.length, 4)
  })
})

describe('id field')
  test('id field not called _id', async () => {
    const response = await api.get('/api/blogs')
    const idColumnName = Object.keys(response.body[0])[4]
    assert.strictEqual(idColumnName, 'id')
  })

describe('adding a blog')
  test('a blog can be added', async () => {
    const allBlogs = await api.get('/api/blogs')
    const currentNumber = allBlogs.body.length
    const allUsers = await api.get('/api/users')
    const firstUser = allUsers.body[0]
    // console.log("first user:", allUsers.body[0].id)
    
    const newBlog = {
        author: 'testaaja',
        title: 'testaus',
        url: 'testi.fi/',
        likes: 0,
        user: firstUser.id
      }

    const userForToken = {
      username: firstUser.username,
      id: firstUser.id
    }
    const token = jwt.sign(userForToken, process.env.SECRET)

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const allBlogsNew = await api.get('/api/blogs')
    const newNumber = allBlogsNew.body.length
    assert.strictEqual(newNumber, currentNumber+1)
    })

describe('likes')
  test('if likes not available then 0', async () => {
    const allUsers = await api.get('/api/users')
    const firstUser = allUsers.body[0]
    
    const newBlog = {
      author: 'testaaja',
      title: 'testaus',
      url: 'testi.fi/',
      user: firstUser.id
    }

    const userForToken = {
      username: firstUser.username,
      id: firstUser.id
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const allBlogs = await api.get('/api/blogs')
    const number = allBlogs.body.length
    const likes = allBlogs.body[number-1]['likes']
    
    assert.strictEqual(likes, 0)
  })


describe('title and url not available')
  test('if title and url fields are not available then 400 bad request', async () => {
    const allUsers = await api.get('/api/users')
    const firstUser = allUsers.body[0]
    
    const noTitle = {
      author: 'testaaja',
      url: 'testi.fi/',
      likes: 0,
      user: firstUser.id
    }

    const userForToken = {
      username: firstUser.username,
      id: firstUser. id
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    const response = await api
      .post('/api/blogs')
      .send(noTitle)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
    assert(response.body.error.includes('Blog validation failed'))
  })


describe('deleting and modifying single blogs')
  test('delete a single blog', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogsNumberStart = blogsAtStart.body.length
  const blogToDelete = blogsAtStart.body[0]
  console.log("number start:", blogsNumberStart)

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await api.get('/api/blogs')
  const blogsNumberEnd = blogsAtEnd.body.length
  console.log("number end:", blogsNumberEnd)
  assert.strictEqual(blogsNumberStart, blogsNumberEnd+1)
})

after(async () => {
  await mongoose.connection.close()
})


  test('modify likes for a single blog', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToModify = blogsAtStart.body[0]

  const blogMod = {
    title: 'edaajan edat',
    author: 'edaaja',
    url: 'edaaja.fi/',
    likes: 0
  }

  await api
    .put(`/api/blogs/${blogToModify.id}`)
    .send(blogMod)
    .expect(200)
  
  const blogsAtEnd = await api.get('/api/blogs')
  assert.notStrictEqual(blogsAtStart.body[0]['likes'], blogsAtEnd.body[0]['likes'])
  })



  describe('creating a new user', () => {
    beforeEach(async () => {
      await User.deleteMany({})
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })
  
      await user.save()
    })
  
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()
      
      const newUser = {
        username: 'testman',
        name: 'Test Man',
        password: 'salainen',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
    })

    
    test('password and username cannot be shorter than the minimum allowed length (3)', async () => {
      
      const usersAtStart = await helper.usersInDb()
      const newUser = {
        username: 'yo',
        name: 'yom',
        password: 'yo',
      }
      const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      
      assert(result.body.error.includes('shorter than the minimum allowed length (3)'))
      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    })



    test('username should be unique', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'testimies',
        password: 'nakkimies'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      console.log("error:", result.body.error)
      assert(result.body.error.includes('expected `username` should be unique'))
      const usersAtEnd = await helper.usersInDb()
      assert(usersAtEnd.length, usersAtStart.length)
    })
  })


  