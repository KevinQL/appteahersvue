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
        </tr>
      </thead>
      <tbody>
        <tr v-for="teacher in teachers" :key="teacher.dni">
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
  }
}
</script>

<style scoped>
.teacher-list {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f5f5f5;
  font-weight: bold;
  color: #333;
}

.cursos-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cursos-list li {
  margin-bottom: 5px;
}

.estado-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
  text-transform: capitalize;
  color: white;
}

.estado-badge.activo {
  background-color: #4CAF50;
}

.estado-badge.inactivo {
  background-color: #f44336;
}

.no-teachers {
  text-align: center;
  color: #666;
  font-style: italic;
  margin-top: 20px;
}
</style> 