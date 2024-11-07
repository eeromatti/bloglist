import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
const setToken = (newToken) => {
  token = `Bearer ${newToken}`
  // console.log("token:", token)
}

const create = async (details) => {
  //haetaan token
  const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
  const user = loggedUserJSON ? JSON.parse(loggedUserJSON) : null
  const token = user ? `Bearer ${user.token}` : null

  const config = {
    headers: { Authorization: token },
  }
  // console.log("details ennen axios.post-kutsua:", details)
  // console.log("config ennen axion post kutsua:", config)
  const response = await axios.post(baseUrl, details, config)
  return response.data
}

export default { create, setToken }