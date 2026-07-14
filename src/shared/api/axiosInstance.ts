import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      (error.response?.status === 404
        ? 'Recurso no encontrado'
        : error.response?.status >= 500
        ? 'Error del servidor'
        : 'Error de conexión con el servidor')

    return Promise.reject(new Error(message))
  }
)

export default api
