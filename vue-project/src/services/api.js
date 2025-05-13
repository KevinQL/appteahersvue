import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export const api = {
  // Obtener todos los docentes
  async getTeachers() {
    const response = await axios.get(`${API_URL}/teachers`)
    return response.data
  },

  // Agregar un docente
  async addTeacher(teacher) {
    const response = await axios.post(`${API_URL}/teachers`, teacher)
    return response.data
  },

  // Eliminar un docente
  async deleteTeacher(id) {
    const response = await axios.delete(`${API_URL}/teachers/${id}`)
    return response.data
  }
} 