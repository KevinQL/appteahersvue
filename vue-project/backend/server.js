// Importación de dependencias necesarias
const express = require('express')        // Framework web para Node.js
const cors = require('cors')             // Middleware para manejar CORS
const mysql = require('mysql2/promise')  // Cliente MySQL con soporte para promesas
const bcrypt = require('bcryptjs')        // Para encriptar contraseñas
const jwt = require('jsonwebtoken')        // Para generar tokens JWT
require('dotenv').config()              // Carga las variables de entorno desde .env

// Creación de la aplicación Express
const app = express()

// Configuración de middleware
app.use(cors())                         // Habilita CORS para todas las rutas
app.use(express.json())                 // Permite procesar JSON en las peticiones

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'teachers_db',
  port: process.env.DB_PORT || 3306
}

// Creación del pool de conexiones
// Un pool permite reutilizar conexiones en lugar de crear nuevas cada vez
const pool = mysql.createPool(dbConfig)

// Middleware de autenticación
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta')
    const [users] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [decoded.userId])
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' })
    }

    req.user = users[0]
    next()
  } catch (error) {
    console.error('Error en autenticación:', error)
    return res.status(403).json({ error: 'Token inválido' })
  }
}

/**
 * Función para inicializar la base de datos
 * Crea las tablas necesarias si no existen
 */
async function initDatabase() {
  try {
    const connection = await pool.getConnection()
    
    // Crear tabla de usuarios si no existe
    await connection.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apellidos VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        rol ENUM('admin', 'user') NOT NULL DEFAULT 'user',
        estado ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
        intentos_fallidos INT DEFAULT 0,
        bloqueado BOOLEAN DEFAULT FALSE,
        ultimo_acceso TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Verificar si existe el usuario administrador
    const [admins] = await connection.query('SELECT * FROM usuarios WHERE rol = "admin"')
    
    if (admins.length === 0) {
      console.log('Creando usuario administrador por defecto...')
      const defaultPassword = 'Admin123!'
      const hashedPassword = await bcrypt.hash(defaultPassword, 10)
      console.log('Contraseña por defecto:', defaultPassword)
      console.log('Hash generado:', hashedPassword)
      
      await connection.query(`
        INSERT INTO usuarios (nombre, apellidos, email, password, rol, estado)
        VALUES (?, ?, ?, ?, ?, ?)
      `, ['Administrador', 'Sistema', 'admin@sistema.com', hashedPassword, 'admin', 'activo'])
      console.log('Usuario administrador creado exitosamente')
    } else {
      console.log('Usuario administrador ya existe:', admins[0].email)
      // Actualizar la contraseña del administrador existente
      const defaultPassword = 'Admin123!'
      const hashedPassword = await bcrypt.hash(defaultPassword, 10)
      await connection.query(
        'UPDATE usuarios SET password = ? WHERE rol = "admin"',
        [hashedPassword]
      )
      console.log('Contraseña de administrador actualizada')
    }

    // Crea la tabla de docentes si no existe
    await connection.query(`
      CREATE TABLE IF NOT EXISTS teachers (
        id INT AUTO_INCREMENT PRIMARY KEY,    -- ID autoincremental
        nombre VARCHAR(100) NOT NULL,         -- Nombre del docente
        apellidos VARCHAR(100) NOT NULL,      -- Apellidos del docente
        dni VARCHAR(20) NOT NULL UNIQUE,      -- DNI único
        estado ENUM('activo', 'inactivo') NOT NULL,  -- Estado del docente
        usuario_creacion INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_creacion) REFERENCES usuarios(id)
      )
    `)

    // Crea la tabla de cursos si no existe
    await connection.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id INT AUTO_INCREMENT PRIMARY KEY,    -- ID autoincremental
        teacher_id INT,                       -- ID del docente (clave foránea)
        nombre VARCHAR(100) NOT NULL,         -- Nombre del curso
        usuario_creacion INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
        FOREIGN KEY (usuario_creacion) REFERENCES usuarios(id)
      )
    `)

    // Libera la conexión de vuelta al pool
    connection.release()
    console.log('Base de datos inicializada correctamente')
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error)
  }
}

// Definición de rutas de la API

/**
 * GET /api/teachers
 * Obtiene todos los docentes con sus cursos
 */
app.get('/api/teachers', authenticateToken, async (req, res) => {
  try {
    // Obtiene todos los docentes
    const [teachers] = await pool.query('SELECT * FROM teachers')
    
    // Para cada docente, obtiene sus cursos
    const teachersWithCourses = await Promise.all(
      teachers.map(async (teacher) => {
        const [courses] = await pool.query(
          'SELECT nombre FROM courses WHERE teacher_id = ?',
          [teacher.id]
        )
        // Combina la información del docente con sus cursos
        return {
          ...teacher,
          cursos: courses.map(course => course.nombre)
        }
      })
    )
    res.json(teachersWithCourses)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * POST /api/teachers
 * Agrega un nuevo docente con sus cursos
 */
app.post('/api/teachers', authenticateToken, async (req, res) => {
  // Obtiene una conexión del pool para la transacción
  const connection = await pool.getConnection()
  try {
    // Inicia una transacción
    await connection.beginTransaction()

    // Extrae los datos del cuerpo de la petición
    const { nombre, apellidos, dni, estado, cursos } = req.body

    // Inserta el docente
    const [result] = await connection.query(
      'INSERT INTO teachers (nombre, apellidos, dni, estado) VALUES (?, ?, ?, ?)',
      [nombre, apellidos, dni, estado]
    )

    // Inserta los cursos del docente
    const teacherId = result.insertId
    for (const curso of cursos) {
      await connection.query(
        'INSERT INTO courses (teacher_id, nombre) VALUES (?, ?)',
        [teacherId, curso]
      )
    }

    // Confirma la transacción
    await connection.commit()
    res.json({ message: 'Docente agregado correctamente' })
  } catch (error) {
    // Si hay error, revierte la transacción
    await connection.rollback()
    res.status(500).json({ error: error.message })
  } finally {
    // Libera la conexión de vuelta al pool
    connection.release()
  }
})

/**
 * DELETE /api/teachers/:id
 * Elimina un docente y sus cursos (por CASCADE)
 */
app.delete('/api/teachers/:id', authenticateToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM teachers WHERE id = ?', [req.params.id])
    res.json({ message: 'Docente eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Rutas de autenticación
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    console.log('Intento de login para:', email)
    console.log('Contraseña recibida:', password)

    const [users] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email])
    
    if (users.length === 0) {
      console.log('Usuario no encontrado:', email)
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const user = users[0]
    console.log('Usuario encontrado:', user.email)
    console.log('Hash almacenado:', user.password)

    if (user.bloqueado) {
      console.log('Usuario bloqueado:', email)
      return res.status(401).json({ error: 'Usuario bloqueado' })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    console.log('Contraseña válida:', validPassword)
    console.log('Comparación de contraseñas:', {
      passwordRecibida: password,
      hashAlmacenado: user.password
    })

    if (!validPassword) {
      // Incrementar intentos fallidos
      await pool.query(
        'UPDATE usuarios SET intentos_fallidos = intentos_fallidos + 1 WHERE id = ?',
        [user.id]
      )
      console.log('Contraseña incorrecta para:', email)
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    // Resetear intentos fallidos y actualizar último acceso
    await pool.query(
      'UPDATE usuarios SET intentos_fallidos = 0, ultimo_acceso = CURRENT_TIMESTAMP WHERE id = ?',
      [user.id]
    )

    const token = jwt.sign(
      { userId: user.id, rol: user.rol },
      process.env.JWT_SECRET || 'tu_clave_secreta',
      { expiresIn: '24h' }
    )

    console.log('Login exitoso para:', email)
    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellidos: user.apellidos,
        email: user.email,
        rol: user.rol
      }
    })
  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Inicia el servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)
  // Inicializa la base de datos al arrancar el servidor
  await initDatabase()
}) 