<script>
import TeacherForm from './components/TeacherForm.vue'
import TeacherList from './components/TeacherList.vue'
import { api } from './services/api'

export default {
  name: 'App',
  components: {
    TeacherForm,
    TeacherList
  },
  data() {
    return {
      teachers: []
    }
  },
  async created() {
    try {
      await this.loadTeachers()
    } catch (error) {
      console.error('Error al inicializar la aplicación:', error)
    }
  },
  methods: {
    async loadTeachers() {
      try {
        this.teachers = await api.getTeachers()
      } catch (error) {
        console.error('Error al cargar docentes:', error)
        throw error
      }
    },
    async addTeacher(teacher) {
      try {
        await api.addTeacher(teacher)
        await this.loadTeachers()
      } catch (error) {
        console.error('Error al agregar docente:', error)
      }
    },
    async deleteTeacher(id) {
      try {
        await api.deleteTeacher(id)
        await this.loadTeachers()
      } catch (error) {
        console.error('Error al eliminar docente:', error)
      }
    }
  }
}
</script>

<template>
  <div class="app">
    <header>
      <h1>Sistema de Gestión de Docentes</h1>
    </header>
    <main>
      <TeacherForm @submit-teacher="addTeacher" />
      <TeacherList :teachers="teachers" @delete-teacher="deleteTeacher" />
    </main>
  </div>
</template>

<style>
.app {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 40px;
}

h1 {
  color: #2196F3;
  margin: 0;
  padding: 20px 0;
}

main {
    display: flex;
  flex-direction: column;
  gap: 40px;
}

.db-status {
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
  font-weight: bold;
  }

.db-status.success {
  background-color: #4CAF50;
  color: white;
  }

.db-status.error {
  background-color: #f44336;
  color: white;
}
</style>
