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
        cursos: [],
        estado: 'activo'
      }
    }
  },
  methods: {
    addCurso() {
      this.teacher.cursos.push('ingrese un curso')
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

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
  font-weight: 500;
}

input, select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #E0E0E0;
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input:focus, select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.curso-item {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  align-items: center;
}

.curso-item input {
  flex: 1;
}

.btn-remove {
  background-color: var(--error-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.btn-remove:hover {
  background-color: #d32f2f;
}

.btn-add {
  background-color: var(--success-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
  margin-top: 1rem;
  width: 100%;
}

.btn-add:hover {
  background-color: #388E3C;
}

.btn-submit {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  width: 100%;
  margin-top: 1rem;
  transition: background-color 0.3s ease;
}

.btn-submit:hover {
  background-color: var(--primary-dark);
}

/* Animaciones para los botones */
.btn-remove, .btn-add, .btn-submit {
  transform: translateY(0);
  transition: transform 0.2s ease;
}

.btn-remove:active, .btn-add:active, .btn-submit:active {
  transform: translateY(2px);
}
</style> 