import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const addBlog = async (request) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, request, config)
  return response.data
}


const updateBlog = async (request, id) => {
  const response = await axios.put(baseUrl+'/'+id, request)
  return response.data
}

const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(baseUrl+'/'+id, config)
  return response.data
}



const exports = { getAll, addBlog, setToken, updateBlog, deleteBlog }

export default exports