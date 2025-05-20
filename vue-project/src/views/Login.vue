<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>Sistema de Gestión</h2>
        <p class="subtitle">Inicia sesión para continuar</p>
      </div>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <div class="input-wrapper">
            <i class="fas fa-envelope"></i>
            <input
              type="email"
              id="email"
              v-model="email"
              required
              autocomplete="email"
              placeholder="ejemplo@correo.com"
            >
          </div>
        </div>
        <div class="form-group">
          <label for="password">Contraseña</label>
          <div class="input-wrapper">
            <i class="fas fa-lock"></i>
            <input
              type="password"
              id="password"
              v-model="password"
              required
              autocomplete="current-password"
              placeholder="Ingrese su contraseña"
            >
          </div>
        </div>
        <button type="submit" class="btn-login" :disabled="loading">
          <span v-if="loading" class="loading-spinner"></span>
          {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
        </button>
        <p v-if="error" class="error-message">{{ error }}</p>
        <p v-if="debugInfo" class="debug-info">{{ debugInfo }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../services/api'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const error = ref('')
    const loading = ref(false)
    const debugInfo = ref('')

    const handleLogin = async () => {
      try {
        loading.value = true
        error.value = ''
        debugInfo.value = 'Intentando iniciar sesión...'

        const credentials = {
          email: email.value,
          password: password.value
        }
        
        debugInfo.value = 'Enviando credenciales...'
        const response = await login(credentials)
        debugInfo.value = 'Respuesta recibida: ' + JSON.stringify(response.data, null, 2)
        
        if (response.data && response.data.token) {
          localStorage.setItem('token', response.data.token)
          debugInfo.value = 'Token almacenado, redirigiendo...'
          router.push('/dashboard')
        } else {
          throw new Error('No se recibió un token válido')
        }
      } catch (err) {
        console.error('Error completo:', err)
        error.value = err.response?.data?.error || err.message || 'Error al iniciar sesión'
        debugInfo.value = `Error detallado: ${JSON.stringify(err.response?.data || err.message, null, 2)}`
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      password,
      error,
      loading,
      debugInfo,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.login-header h2 {
  color: #2d3748;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #718096;
  font-size: 1rem;
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

.form-group label {
  color: #4a5568;
  font-weight: 500;
  font-size: 0.95rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper i {
  position: absolute;
  left: 1rem;
  color: #a0aec0;
}

.form-group input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f8fafc;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background-color: #fff;
}

.btn-login {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-login:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.btn-login:disabled {
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

.error-message {
  color: #e53e3e;
  text-align: center;
  font-size: 0.9rem;
  padding: 0.75rem;
  background-color: #fff5f5;
  border-radius: 6px;
  border: 1px solid #feb2b2;
}

.debug-info {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f7fafc;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.875rem;
  color: #4a5568;
  white-space: pre-wrap;
  word-break: break-all;
  border: 1px solid #e2e8f0;
}

/* Responsive Design */
@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem;
  }

  .login-header h2 {
    font-size: 1.5rem;
  }

  .form-group input {
    padding: 0.75rem 1rem 0.75rem 2.25rem;
  }

  .btn-login {
    padding: 0.875rem;
  }
}

@media (max-width: 360px) {
  .login-card {
    padding: 1.25rem;
  }

  .login-header h2 {
    font-size: 1.25rem;
  }

  .subtitle {
    font-size: 0.875rem;
  }
}
</style> 