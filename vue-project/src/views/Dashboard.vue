<template>
  <div class="dashboard-container">
    <nav class="dashboard-nav">
      <div class="nav-content">
        <div class="nav-brand">
          <h1>Sistema de Gestión</h1>
        </div>
        <div class="nav-user">
          <span class="user-name">{{ user?.nombre }} {{ user?.apellidos }}</span>
          <button @click="handleLogout" class="btn-logout">
            <i class="fas fa-sign-out-alt"></i>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>

    <main class="dashboard-main">
      <div class="dashboard-header">
        <h2>Gestión de Docentes</h2>
        <button @click="showForm = true" class="btn-add">
          <i class="fas fa-plus"></i>
          Agregar Docente
        </button>
      </div>

      <div class="dashboard-content">
        <TeacherList v-if="!showForm" />
        <TeacherForm v-else @close="showForm = false" />
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TeacherList from '../components/TeacherList.vue'
import TeacherForm from '../components/TeacherForm.vue'

export default {
  name: 'Dashboard',
  components: {
    TeacherList,
    TeacherForm
  },
  setup() {
    const router = useRouter()
    const showForm = ref(false)
    const user = ref(null)

    onMounted(() => {
      const userData = localStorage.getItem('user')
      if (userData) {
        user.value = JSON.parse(userData)
      }
    })

    const handleLogout = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
    }

    return {
      showForm,
      user,
      handleLogout
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: #f0f2f5;
  display: flex;
  flex-direction: column;
}

.dashboard-nav {
  background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%);
  padding: 1.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.nav-content {
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  padding: 0 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand h1 {
  color: #ffffff;
  font-size: 2rem;
  margin: 0;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.user-name {
  color: #ffffff;
  font-weight: 500;
  font-size: 1.1rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.btn-logout {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  font-size: 1rem;
  backdrop-filter: blur(4px);
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.dashboard-main {
  padding: 3rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
  flex: 1;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
}

.dashboard-header h2 {
  color: #1a365d;
  font-size: 2rem;
  margin: 0;
  font-weight: 600;
}

.btn-add {
  background: #2c5282;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-add:hover {
  background: #1a365d;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dashboard-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  min-height: calc(100vh - 300px);
}

/* Responsive Design */
@media (min-width: 1920px) {
  .nav-content {
    max-width: 1800px;
  }
  
  .dashboard-main {
    max-width: 1800px;
  }
}

@media (max-width: 768px) {
  .nav-content {
    padding: 0 1.5rem;
    flex-direction: column;
    gap: 1rem;
  }

  .dashboard-nav {
    padding: 1rem 0;
  }

  .nav-user {
    flex-direction: column;
    gap: 1rem;
  }

  .dashboard-main {
    padding: 1.5rem;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .btn-add {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .nav-content {
    padding: 0 1rem;
  }

  .nav-brand h1 {
    font-size: 1.5rem;
  }

  .dashboard-header h2 {
    font-size: 1.5rem;
  }

  .dashboard-content {
    padding: 1rem;
  }
}
</style> 