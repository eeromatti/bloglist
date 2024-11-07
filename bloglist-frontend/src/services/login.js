import axios from 'axios'
const baseUrl = '/api/login'

const login = async credentials => {
//   console.log('sending credentials:', credentials)
  const response = await axios.post(baseUrl, credentials)
  //   console.log('response from login route:', response.data)
  return response.data
}

export default { login }