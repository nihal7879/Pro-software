import axios, { type AxiosInstance } from 'axios'

/**
 * Pre-configured Axios instance. The base URL points to a placeholder API so
 * the app is ready for real backend integration. All current data flows
 * through the mock service layer, but interceptors are wired for the future.
 */
export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('procura.token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)
