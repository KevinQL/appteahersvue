<template>
  <div class="teacher-form">
    <h2>Registro de Docente</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="nombre">Nombre:</label>
        <input 
          type="text" 
          id="nombre" 
          v-model="teacher.nombre" 
          required
        >
      </div>

      <div class="form-group">
        <label for="apellidos">Apellidos:</label>
        <input 
          type="text" 
          id="apellidos" 
          v-model="teacher.apellidos" 
          required
        >
      </div>

      <div class="form-group">
        <label for="dni">DNI:</label>
        <input 
          type="text" 
          id="dni" 
          v-model="teacher.dni" 
          required
        >
      </div>

      <div class="form-group">
        <label>Cursos:</label>
        <div v-for="(curso, index) in teacher.cursos" :key="index" class="curso-item">
          <input 
            type="text" 
            v-model="teacher.cursos[index]" 
            required
            placeholder="Nombre del curso"
          >
          <button type="button" @click="removeCurso(index)" class="btn-remove">Eliminar</button>
        </div>
        <button type="button" @click="addCurso" class="btn-add">Agregar Curso</button>
      </div>

      <div class="form-group">
        <label for="estado">Estado:</label>
        <select id="estado" v-model="teacher.estado" required>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>

      <button type="submit" class="btn-submit">Guardar Docente</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'TeacherForm',
  data() {
    return {
      teacher: {
        nombre: '',
        apellidos: '',
        dni: '',
        cursos: [''],
        estado: 'activo'
      }
    }
  },
  methods: {
    addCurso() {
      this.teacher.cursos.push('')
    },
    removeCurso(index) {
      this.teacher.cursos.splice(index, 1)
    },
    handleSubmit() {
      this.$emit('submit-teacher', { ...this.teacher })
      // Resetear el formulario
      this.teacher = {
        nombre: '',
        apellidos: '',
        dni: '',
        cursos: [''],
        estado: 'activo'
      }
    }
  }
}
</script>

<style scoped>
.teacher-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.curso-item {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.btn-remove {
  background-color: #ff4444;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-add {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.btn-submit {
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

.btn-submit:hover {
  background-color: #1976D2;
}
</style> 