import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('Error en la petición:', error)
    return Promise.reject(error)
  }
)

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en la respuesta:', error.response || error)
    
    if (error.response) {
      // Error del servidor
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // Token expirado o inválido
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.location.href = '/login'
          break
        case 403:
          // No autorizado
          return Promise.reject(new Error('No tiene permisos para realizar esta acción'))
        case 404:
          // Recurso no encontrado
          return Promise.reject(new Error('El recurso solicitado no existe'))
        case 500:
          // Error del servidor
          return Promise.reject(new Error(data.error || 'Error interno del servidor'))
        default:
          // Otros errores
          return Promise.reject(new Error(data.error || 'Error en la petición'))
      }
    } else if (error.request) {
      // No se recibió respuesta del servidor
      return Promise.reject(new Error('No se pudo conectar con el servidor'))
    } else {
      // Error en la configuración de la petición
      return Promise.reject(new Error('Error en la configuración de la petición'))
    }
  }
)

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials)
    return response
  } catch (error) {
    throw error
  }
}

export const getTeachers = async () => {
  try {
    const response = await api.get('/teachers')
    return response
  } catch (error) {
    throw error
  }
}

export const createTeacher = async (teacherData) => {
  try {
    const response = await api.post('/teachers', teacherData)
    return response
  } catch (error) {
    throw error
  }
}

export const deleteTeacher = async (id) => {
  try {
    const response = await api.delete(`/teachers/${id}`)
    return response
  } catch (error) {
    throw error
  }
}

export const getCourses = () => {
  return api.get('/courses')
}

export const createCourse = (courseData) => {
  return api.post('/courses', courseData)
}

export const deleteCourse = (id) => {
  return api.delete(`/courses/${id}`)
}

export default api 