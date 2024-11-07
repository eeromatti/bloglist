/* eslint-disable quotes */
import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogList from './components/BlogList'
import blogService from './services/blogs'
import loginService from './services/login'
import createService from './services/create'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const blogFormRef = useRef()
  const blogRef = useRef()

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogsUnsorted = await blogService.getAll()
      setBlogs(blogsUnsorted)
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loggedIn = () => (
    <div>
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
    </div>
  )

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      createService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleDelete = (id) => {
    console.log("handle funktiota kutsutaan")
    // setBlogs(blogs.filter(blog => blog.id !== id))
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      })
  }

  if (user === null) {
    return (
      <div>
        <h2>Blogs</h2>
        <Notification message={errorMessage} />
        <Togglable buttonLabel='log in'>
          <LoginForm
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            handleLogin={handleLogin}
          />
        </Togglable>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} />
      {loggedIn()}
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm
          createBlog = {addBlog}
        />
      </Togglable>
      {/* {blogList()} */}
      <BlogList blogs = {blogs}/>
    </div>
  )
}

export default App