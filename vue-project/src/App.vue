<script>
import TeacherForm from './components/TeacherForm.vue'
import TeacherList from './components/TeacherList.vue'

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
  methods: {
    addTeacher(teacher) {
      this.teachers.push(teacher)
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
      <TeacherList :teachers="teachers" />
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
</style>
