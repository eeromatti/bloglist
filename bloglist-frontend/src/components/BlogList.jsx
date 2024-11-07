import { useState, useImperativeHandle } from 'react'
import Blog from './Blog'

const BlogList = ({ blogs, setBlogs }) => {

  const blogsSorted = [...blogs].sort((a, b) => b.likes - a.likes)
  // const handleDelete = (id) => {
  //   // console.log("handle funktiota kutsutaan")
  //   setSortedBlogs(sortedBlogs().filter(blog => blog.id !== id))
  // }

  return (
    <div>
      {blogsSorted.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default BlogList