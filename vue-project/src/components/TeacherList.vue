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
            <ul class="cursos-list">
              <li v-for="(curso, index) in teacher.cursos" :key="index">
                {{ curso }}
              </li>
            </ul>
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
  methods: {
    deleteTeacher(id) {
      if (confirm('¿Estás seguro de que deseas eliminar este docente?')) {
        this.$emit('delete-teacher', id)
      }
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

/* Responsive */
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
}
</style> 