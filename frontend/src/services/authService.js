import api from './api.js'

async function registerUser(payload) {
  const response = await api.post('/auth/register', payload)
  return response.data.data
}

async function loginUser(payload) {
  const response = await api.post('/auth/login', payload)
  return response.data.data
}

async function getCurrentUser() {
  const response = await api.get('/auth/me')
  return response.data.data
}

export default {
  getCurrentUser,
  loginUser,
  registerUser,
}
