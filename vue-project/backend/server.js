// Importación de dependencias necesarias
const express = require('express')        // Framework web para Node.js
const cors = require('cors')             // Middleware para manejar CORS
const mysql = require('mysql2/promise')  // Cliente MySQL con soporte para promesas
require('dotenv').config()              // Carga las variables de entorno desde .env

// Creación de la aplicación Express
const app = express()

// Configuración de middleware
app.use(cors())                         // Habilita CORS para todas las rutas
app.use(express.json())                 // Permite procesar JSON en las peticiones

// Configuración de la base de datos usando variables de entorno
// Si las variables no están definidas en .env, usa los valores por defecto
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
}

// Creación del pool de conexiones
// Un pool permite reutilizar conexiones en lugar de crear nuevas cada vez
const pool = mysql.createPool(dbConfig)

/**
 * Función para inicializar la base de datos
 * Crea las tablas necesarias si no existen
 */
async function initDatabase() {
  try {
    // Obtiene una conexión del pool
    const connection = await pool.getConnection()
    
    // Crea la tabla de docentes si no existe
    await connection.query(`
      CREATE TABLE IF NOT EXISTS teachers (
        id INT AUTO_INCREMENT PRIMARY KEY,    -- ID autoincremental
        nombre VARCHAR(100) NOT NULL,         -- Nombre del docente
        apellidos VARCHAR(100) NOT NULL,      -- Apellidos del docente
        dni VARCHAR(20) NOT NULL UNIQUE,      -- DNI único
        estado ENUM('activo', 'inactivo') NOT NULL,  -- Estado del docente
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Fecha de creación
      )
    `)

    // Crea la tabla de cursos si no existe
    await connection.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id INT AUTO_INCREMENT PRIMARY KEY,    -- ID autoincremental
        teacher_id INT,                       -- ID del docente (clave foránea)
        nombre VARCHAR(100) NOT NULL,         -- Nombre del curso
        FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE  -- Relación con teachers
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
app.get('/api/teachers', async (req, res) => {
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
app.post('/api/teachers', async (req, res) => {
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
app.delete('/api/teachers/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM teachers WHERE id = ?', [req.params.id])
    res.json({ message: 'Docente eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Inicia el servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)
  // Inicializa la base de datos al arrancar el servidor
  await initDatabase()
}) 