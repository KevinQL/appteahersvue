<template>
  <div class="form-container">
    <div class="form-header">
      <h3>Agregar Nuevo Docente</h3>
      <button @click="$emit('close')" class="btn-close">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="teacher-form">
      <div v-if="error" class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        {{ error }}
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label for="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            v-model="formData.nombre"
            required
            placeholder="Ingrese el nombre"
          >
        </div>

        <div class="form-group">
          <label for="apellidos">Apellidos</label>
          <input
            type="text"
            id="apellidos"
            v-model="formData.apellidos"
            required
            placeholder="Ingrese los apellidos"
          >
        </div>

        <div class="form-group">
          <label for="dni">DNI</label>
          <input
            type="text"
            id="dni"
            v-model="formData.dni"
            required
            placeholder="Ingrese el DNI"
          >
        </div>

        <div class="form-group">
          <label for="estado">Estado</label>
          <select id="estado" v-model="formData.estado" required>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      <div class="form-group courses-section">
        <label>Cursos</label>
        <div class="courses-list">
          <div v-for="(curso, index) in formData.cursos" :key="index" class="course-item">
            <input
              type="text"
              v-model="formData.cursos[index]"
              placeholder="Nombre del curso"
              required
            >
            <button type="button" @click="removeCourse(index)" class="btn-remove">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <button type="button" @click="addCourse" class="btn-add-course">
          <i class="fas fa-plus"></i>
          Agregar Curso
        </button>
      </div>

      <div class="form-actions">
        <button type="button" @click="$emit('close')" class="btn-cancel">
          Cancelar
        </button>
        <button type="submit" class="btn-submit" :disabled="loading">
          <span v-if="loading" class="loading-spinner"></span>
          {{ loading ? 'Guardando...' : 'Guardar Docente' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { createTeacher } from '../services/api'

export default {
  name: 'TeacherForm',
  emits: ['close', 'teacher-created'],
  setup(props, { emit }) {
    const formData = ref({
      nombre: '',
      apellidos: '',
      dni: '',
      estado: 'activo',
      cursos: ['']
    })
    const loading = ref(false)
    const error = ref('')

    const addCourse = () => {
      formData.value.cursos.push('')
    }

    const removeCourse = (index) => {
      if (formData.value.cursos.length > 1) {
        formData.value.cursos.splice(index, 1)
      }
    }

    const validateForm = () => {
      if (!formData.value.nombre.trim()) {
        error.value = 'El nombre es requerido'
        return false
      }
      if (!formData.value.apellidos.trim()) {
        error.value = 'Los apellidos son requeridos'
        return false
      }
      if (!formData.value.dni.trim()) {
        error.value = 'El DNI es requerido'
        return false
      }
      if (formData.value.cursos.some(curso => !curso.trim())) {
        error.value = 'Todos los cursos deben tener un nombre'
        return false
      }
      return true
    }

    const handleSubmit = async () => {
      try {
        error.value = ''
        if (!validateForm()) return

        loading.value = true
        const response = await createTeacher({
          ...formData.value,
          cursos: formData.value.cursos.filter(curso => curso.trim())
        })
        
        emit('teacher-created', response.data)
        emit('close')
      } catch (err) {
        console.error('Error al crear docente:', err)
        error.value = err.response?.data?.error || 'Error al crear el docente. Por favor, intente nuevamente.'
      } finally {
        loading.value = false
      }
    }

    return {
      formData,
      loading,
      error,
      addCourse,
      removeCourse,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.form-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.form-header h3 {
  color: #1a365d;
  font-size: 2rem;
  margin: 0;
  font-weight: 600;
}

.btn-close {
  background: none;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.75rem;
  transition: color 0.3s ease;
}

.btn-close:hover {
  color: #4a5568;
}

.teacher-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-group label {
  color: #1a365d;
  font-weight: 500;
  font-size: 1.1rem;
}

.form-group input,
.form-group select {
  padding: 1rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  background-color: #ffffff;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #2c5282;
  box-shadow: 0 0 0 3px rgba(44, 82, 130, 0.1);
  background-color: #fff;
}

.courses-section {
  margin-top: 1.5rem;
}

.courses-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.course-item {
  display: flex;
  gap: 1.25rem;
}

.course-item input {
  flex: 1;
  padding: 1rem 1.25rem;
  font-size: 1.1rem;
}

.btn-remove {
  background: #fed7d7;
  color: #c53030;
  border: none;
  padding: 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  min-width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove:hover {
  background: #feb2b2;
  transform: translateY(-1px);
}

.btn-add-course {
  background: #ebf8ff;
  color: #2c5282;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-top: 1.5rem;
  font-size: 1.1rem;
}

.btn-add-course:hover {
  background: #bee3f8;
  transform: translateY(-1px);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1.5rem;
  margin-top: 3rem;
}

.btn-cancel {
  background: #e2e8f0;
  color: #1a365d;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  min-width: 150px;
}

.btn-cancel:hover {
  background: #cbd5e0;
  transform: translateY(-1px);
}

.btn-submit {
  background: #2c5282;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  min-width: 200px;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-submit:hover {
  background: #1a365d;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-submit:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (min-width: 1920px) {
  .form-container {
    max-width: 1400px;
  }

  .form-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-submit {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .form-container {
    padding: 1rem;
  }

  .form-header h3 {
    font-size: 1.25rem;
  }

  .course-item {
    flex-direction: column;
  }

  .btn-remove {
    width: 100%;
  }
}

.error-message {
  background-color: #fff5f5;
  color: #c53030;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid #feb2b2;
  font-size: 1rem;
}

.error-message i {
  font-size: 1.25rem;
}
</style> 