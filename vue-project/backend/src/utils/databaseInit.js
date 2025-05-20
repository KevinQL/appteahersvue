const pool = require('../config/database')
const bcrypt = require('bcryptjs')

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
      
      await connection.query(`
        INSERT INTO usuarios (nombre, apellidos, email, password, rol, estado)
        VALUES (?, ?, ?, ?, ?, ?)
      `, ['Administrador', 'Sistema', 'admin@sistema.com', hashedPassword, 'admin', 'activo'])
      console.log('Usuario administrador creado exitosamente')
    }

    // Crea la tabla de docentes si no existe
    await connection.query(`
      CREATE TABLE IF NOT EXISTS teachers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apellidos VARCHAR(100) NOT NULL,
        dni VARCHAR(20) NOT NULL UNIQUE,
        estado ENUM('activo', 'inactivo') NOT NULL,
        usuario_creacion INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_creacion) REFERENCES usuarios(id)
      )
    `)

    // Crea la tabla de cursos si no existe
    await connection.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        teacher_id INT,
        nombre VARCHAR(100) NOT NULL,
        usuario_creacion INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
        FOREIGN KEY (usuario_creacion) REFERENCES usuarios(id)
      )
    `)

    connection.release()
    console.log('Base de datos inicializada correctamente')
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error)
  }
}

module.exports = initDatabase 