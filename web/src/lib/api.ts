import axios from 'axios'
import { API_BASE } from './constants.ts'

export const instance = axios.create({
  baseURL: API_BASE,
  validateStatus: () => true
})

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (config.headers.Authorization === undefined && token) {
    config.headers.Authorization = `token ${token}`
  }
  return config
})

instance.interceptors.response.use(response => {
  if (
    response.status === 401 &&
    !window.location.pathname.startsWith('/auth')
  ) {
    localStorage.removeItem('token')
    window.location.href = '/auth'
  }
  return response
})
