<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Iniciar Sesión</h2>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required 
            placeholder="Ingrese su correo electrónico"
          >
        </div>
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required 
            placeholder="Ingrese su contraseña"
          >
        </div>
        <button type="submit" class="btn-login">Iniciar Sesión</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    async handleLogin() {
      try {
        // Aquí irá la lógica de autenticación
        console.log('Login attempt:', { email: this.email, password: this.password })
        // Por ahora solo redirigimos al dashboard
        this.$router.push('/dashboard')
      } catch (error) {
        console.error('Error en el login:', error)
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--background-color);
  padding: 1rem;
}

.login-card {
  background-color: var(--card-background);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  width: 100%;
  max-width: 400px;
}

h2 {
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  color: var(--text-primary);
  font-weight: 500;
}

input {
  padding: 0.75rem;
  border: 1px solid #E0E0E0;
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.btn-login {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-login:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
}

.btn-login:active {
  transform: translateY(0);
}

@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem;
  }
}
</style> 