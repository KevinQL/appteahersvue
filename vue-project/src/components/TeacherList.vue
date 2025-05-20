<template>
  <div class="teacher-list">
    <h2>Lista de Docentes</h2>
    <table v-if="teachers.length > 0">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Apellidos</th>
          <th>DNI</th>
          <th>Cursos</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="teacher in teachers" :key="teacher.id">
          <td>{{ teacher.nombre }}</td>
          <td>{{ teacher.apellidos }}</td>
          <td>{{ teacher.dni }}</td>
          <td>
            <button @click="openCoursesModal(teacher)" class="btn-courses">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              Ver Cursos
            </button>
          </td>
          <td>
            <span :class="['estado-badge', teacher.estado]">
              {{ teacher.estado }}
            </span>
          </td>
          <td>
            <button @click="deleteTeacher(teacher.id)" class="btn-delete">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="no-teachers">No hay docentes registrados</p>

    <!-- Modal de Cursos -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Cursos de {{ selectedTeacher?.nombre }} {{ selectedTeacher?.apellidos }}</h3>
          <button class="btn-close" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <ul class="modal-courses-list">
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
export default {
  name: 'TeacherList',
  props: {
    teachers: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      showModal: false,
      selectedTeacher: null
    }
  },
  methods: {
    deleteTeacher(id) {
      if (confirm('¿Estás seguro de que deseas eliminar este docente?')) {
        this.$emit('delete-teacher', id)
      }
    },
    openCoursesModal(teacher) {
      this.selectedTeacher = teacher
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.selectedTeacher = null
    }
  }
}
</script>

<style scoped>
.teacher-list {
  background-color: var(--card-background);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

h2 {
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 1rem;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #E0E0E0;
}

th {
  background-color: var(--primary-light);
  color: var(--primary-dark);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
}

tr:hover {
  background-color: #F5F5F5;
}

.cursos-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.cursos-list li {
  background-color: var(--primary-light);
  color: var(--primary-dark);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.estado-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: capitalize;
  display: inline-block;
  min-width: 100px;
  text-align: center;
}

.estado-badge.activo {
  background-color: var(--success-color);
  color: white;
}

.estado-badge.inactivo {
  background-color: var(--error-color);
  color: white;
}

.no-teachers {
  text-align: center;
  color: var(--text-secondary);
  font-style: italic;
  padding: 2rem;
  background-color: #F5F5F5;
  border-radius: var(--border-radius);
  margin-top: 1rem;
}

.btn-delete {
  background-color: var(--error-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-delete:hover {
  background-color: #d32f2f;
  transform: translateY(-2px);
}

.btn-delete:active {
  transform: translateY(0);
}

.btn-courses {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-courses:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
}

.btn-courses:active {
  transform: translateY(0);
}

.btn-courses svg {
  width: 16px;
  height: 16px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background-color: var(--card-background);
  border-radius: var(--border-radius);
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #E0E0E0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  color: var(--primary-color);
  margin: 0;
  font-size: 1.25rem;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
  transition: color 0.3s ease;
}

.btn-close:hover {
  color: var(--error-color);
}

.modal-body {
  padding: 1.5rem;
}

.modal-courses-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.modal-courses-list li {
  background-color: var(--primary-light);
  color: var(--primary-dark);
  padding: 1rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-courses-list li::before {
  content: "📚";
  font-size: 1.25rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Responsive adjustments for modal */
@media (max-width: 768px) {
  .teacher-list {
    padding: 1rem;
  }

  table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  th, td {
    padding: 0.75rem;
  }

  .cursos-list {
    flex-direction: column;
  }

  .modal-content {
    width: 95%;
    margin: 1rem;
  }
}
</style> 