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
:root {
  --primary-color: #006de9;
  --primary-dark: #1976D2;
  --primary-light: #BBDEFB;
  --accent-color: #FF4081;
  --text-primary: #212121;
  --text-secondary: #757575;
  --background-color: #F5F5F5;
  --card-background: #FFFFFF;
  --error-color: #f44336;
  --success-color: #4CAF50;
  --border-radius: 8px;
  --box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: var(--background-color);
  color: var(--text-primary);
  line-height: 1.6;
}

.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px;
  background-color: var(--card-background);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

h1 {
  color: var(--primary-color);
  margin: 0;
  font-size: 2.5rem;
  font-weight: 600;
}

main {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
}

@media (min-width: 1024px) {
  main {
    grid-template-columns: 350px 1fr;
  }
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

main > * {
  animation: fadeIn 0.5s ease-out;
}

.db-status {
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
  font-weight: bold;
}

.db-status.success {
  background-color: var(--success-color);
  color: white;
}

.db-status.error {
  background-color: var(--error-color);
  color: white;
}
</style>
