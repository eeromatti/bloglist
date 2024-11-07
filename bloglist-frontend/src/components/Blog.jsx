import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, handleLikeUpdate }) => {

  const [visible, setVisible] = useState(false)
  const [updatedBlog, setUpdatedBlog] = useState(blog)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const addLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes+1
    }
    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    setUpdatedBlog(returnedBlog)
  }

  const removeBlog = async () => {
    if (window.confirm(`Poistetaanko blogi ${blog.title} ?`)) {
      await blogService.remove(blog.id)
    }
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div>
          <div style={{ marginBottom: '2px' }}>{blog.url}</div>
          <div style={{ marginBottom: '2px' }}>
        likes {updatedBlog.likes}
            <button onClick={addLike}>like</button>
          </div>
          <div style={{ marginBottom: '2px' }}>{blog.user.name}</div>
          <button onClick={removeBlog}>remove</button>
        </div>
      )}
    </div>
  )}

export default Blog