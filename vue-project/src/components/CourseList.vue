<template>
  <div class="courses-container">
    <h2>Lista de Cursos</h2>
    <div class="courses-grid">
      <div v-for="course in courses" :key="course.id" class="course-card">
        <h3>{{ course.nombre }}</h3>
        <p>Profesor: {{ course.teacher_name }}</p>
        <div class="course-actions">
          <button class="btn-edit" @click="editCourse(course)">
            <i class="fas fa-edit"></i> Editar
          </button>
          <button class="btn-delete" @click="deleteCourse(course.id)">
            <i class="fas fa-trash"></i> Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'CourseList',
  setup() {
    const courses = ref([])

    const loadCourses = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:3000/api/courses', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        courses.value = response.data
      } catch (error) {
        console.error('Error al cargar cursos:', error)
      }
    }

    const editCourse = (course) => {
      // Implementar edición de curso
      console.log('Editar curso:', course)
    }

    const deleteCourse = async (courseId) => {
      if (confirm('¿Está seguro de eliminar este curso?')) {
        try {
          const token = localStorage.getItem('token')
          await axios.delete(`http://localhost:3000/api/courses/${courseId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          await loadCourses()
        } catch (error) {
          console.error('Error al eliminar curso:', error)
        }
      }
    }

    onMounted(() => {
      loadCourses()
    })

    return {
      courses,
      editCourse,
      deleteCourse
    }
  }
}
</script>

<style scoped>
.courses-container {
  padding: 2rem;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.course-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.course-card:hover {
  transform: translateY(-5px);
}

.course-card h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.course-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-edit, .btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s ease;
}

.btn-edit {
  background-color: #3498db;
  color: white;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
}

.btn-edit:hover {
  background-color: #2980b9;
}

.btn-delete:hover {
  background-color: #c0392b;
}
</style> 