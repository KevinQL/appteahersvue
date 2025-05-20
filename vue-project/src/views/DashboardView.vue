<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Panel de Control</h1>
      <button @click="handleLogout" class="btn-logout">Cerrar Sesión</button>
    </header>
    <main class="dashboard-content">
      <div class="dashboard-grid">
        <div class="dashboard-card">
          <h3>Docentes</h3>
          <p class="card-value">{{ teachersCount }}</p>
          <router-link to="/teachers" class="card-link">Ver todos</router-link>
        </div>
        <div class="dashboard-card">
          <h3>Cursos</h3>
          <p class="card-value">{{ coursesCount }}</p>
          <router-link to="/courses" class="card-link">Ver todos</router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'DashboardView',
  data() {
    return {
      teachersCount: 0,
      coursesCount: 0
    }
  },
  methods: {
    handleLogout() {
      // Aquí irá la lógica de cierre de sesión
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background-color: var(--background-color);
  padding: 2rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  color: var(--primary-color);
  font-size: 2rem;
  margin: 0;
}

.btn-logout {
  background-color: var(--error-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-logout:hover {
  background-color: #d32f2f;
  transform: translateY(-2px);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.dashboard-card {
  background-color: var(--card-background);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  text-align: center;
}

.dashboard-card h3 {
  color: var(--text-primary);
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
}

.card-value {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--primary-color);
  margin: 1rem 0;
}

.card-link {
  display: inline-block;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.card-link:hover {
  color: var(--primary-dark);
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style> 