<template>
  <div class="teacher-list">
    <div class="list-header">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Buscar docentes..."
          @input="filterTeachers"
        >
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>DNI</th>
            <th>Estado</th>
            <th>Cursos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="teacher in filteredTeachers" :key="teacher.id">
            <td>{{ teacher.nombre }}</td>
            <td>{{ teacher.apellidos }}</td>
            <td>{{ teacher.dni }}</td>
            <td>
              <span :class="['status-badge', teacher.estado]">
                {{ teacher.estado }}
              </span>
            </td>
            <td>
              <button @click="showCourses(teacher)" class="btn-courses">
                <i class="fas fa-book"></i>
                Ver Cursos
              </button>
            </td>
            <td>
              <div class="actions">
                <button @click="deleteTeacher(teacher.id)" class="btn-delete">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de Cursos -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Cursos de {{ selectedTeacher?.nombre }} {{ selectedTeacher?.apellidos }}</h3>
          <button @click="closeModal" class="btn-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <ul class="courses-list">
            <li v-for="(curso, index) in selectedTeacher?.cursos" :key="index">
              {{ curso }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getTeachers, deleteTeacher } from '../services/api'

export default {
  name: 'TeacherList',
  setup() {
    const teachers = ref([])
    const filteredTeachers = ref([])
    const searchQuery = ref('')
    const showModal = ref(false)
    const selectedTeacher = ref(null)

    const loadTeachers = async () => {
      try {
        const response = await getTeachers()
        teachers.value = response.data
        filteredTeachers.value = response.data
      } catch (error) {
        console.error('Error al cargar docentes:', error)
      }
    }

    const filterTeachers = () => {
      const query = searchQuery.value.toLowerCase()
      filteredTeachers.value = teachers.value.filter(teacher => 
        teacher.nombre.toLowerCase().includes(query) ||
        teacher.apellidos.toLowerCase().includes(query) ||
        teacher.dni.toLowerCase().includes(query)
      )
    }

    const showCourses = (teacher) => {
      selectedTeacher.value = teacher
      showModal.value = true
    }

    const closeModal = () => {
      showModal.value = false
      selectedTeacher.value = null
    }

    const handleDeleteTeacher = async (id) => {
      if (confirm('¿Está seguro de eliminar este docente?')) {
        try {
          await deleteTeacher(id)
          await loadTeachers()
        } catch (error) {
          console.error('Error al eliminar docente:', error)
        }
      }
    }

    onMounted(loadTeachers)

    return {
      teachers,
      filteredTeachers,
      searchQuery,
      showModal,
      selectedTeacher,
      filterTeachers,
      showCourses,
      closeModal,
      deleteTeacher: handleDeleteTeacher
    }
  }
}
</script>

<style scoped>
.teacher-list {
  width: 100%;
}

.list-header {
  margin-bottom: 2rem;
}

.search-box {
  position: relative;
  max-width: 500px;
}

.search-box i {
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
  font-size: 1.1rem;
}

.search-box input {
  width: 100%;
  padding: 1rem 1.25rem 1rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  background-color: #ffffff;
}

.search-box input:focus {
  outline: none;
  border-color: #2c5282;
  box-shadow: 0 0 0 3px rgba(44, 82, 130, 0.1);
  background-color: #fff;
}

.table-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
  margin: 0 -1rem;
  padding: 0 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
}

th, td {
  padding: 1.25rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
  font-size: 1.1rem;
}

th {
  background-color: #f8fafc;
  font-weight: 600;
  color: #1a365d;
  white-space: nowrap;
}

tr:hover {
  background-color: #f0f2f5;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 1rem;
  font-weight: 500;
  display: inline-block;
  min-width: 100px;
  text-align: center;
}

.status-badge.activo {
  background-color: #c6f6d5;
  color: #2f855a;
}

.status-badge.inactivo {
  background-color: #fed7d7;
  color: #c53030;
}

.btn-courses {
  background: #ebf8ff;
  color: #2c5282;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  min-width: 140px;
  justify-content: center;
}

.btn-courses:hover {
  background: #bee3f8;
  transform: translateY(-1px);
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-delete {
  background: #fed7d7;
  color: #c53030;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1rem;
}

.btn-delete:hover {
  background: #feb2b2;
  transform: translateY(-1px);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  color: #1a365d;
  font-size: 1.5rem;
  font-weight: 600;
}

.btn-close {
  background: none;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.5rem;
  transition: color 0.3s ease;
}

.btn-close:hover {
  color: #4a5568;
}

.modal-body {
  padding: 2rem;
}

.courses-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.courses-list li {
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-radius: 8px;
  color: #1a365d;
  font-size: 1.1rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.courses-list li:hover {
  background: #f0f2f5;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Responsive Design */
@media (min-width: 1920px) {
  .search-box {
    max-width: 600px;
  }

  table {
    min-width: 1200px;
  }

  .modal-content {
    max-width: 1000px;
  }
}

@media (max-width: 768px) {
  .search-box {
    max-width: 100%;
  }

  .table-container {
    margin: 0 -1rem;
    border-radius: 0;
  }

  .modal-content {
    width: 95%;
    margin: 1rem;
  }
}

@media (max-width: 480px) {
  th, td {
    padding: 0.75rem;
  }

  .status-badge {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }

  .btn-courses {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
  }

  .modal-header h3 {
    font-size: 1.125rem;
  }
}
</style> 