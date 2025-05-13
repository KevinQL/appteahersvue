import pool from './db.config'

// Crear la tabla de docentes si no existe
export const initDatabase = async () => {
  try {
    const connection = await pool.getConnection()
    await connection.query(`
      CREATE TABLE IF NOT EXISTS teachers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apellidos VARCHAR(100) NOT NULL,
        dni VARCHAR(20) NOT NULL UNIQUE,
        estado ENUM('activo', 'inactivo') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await connection.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        teacher_id INT,
        nombre VARCHAR(100) NOT NULL,
        FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
      )
    `)

    connection.release()
    console.log('Base de datos inicializada correctamente')
    return true
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error)
    return false
  }
}

// Obtener todos los docentes con sus cursos
export const getAllTeachers = async () => {
  try {
    const [teachers] = await pool.query('SELECT * FROM teachers')
    const teachersWithCourses = await Promise.all(
      teachers.map(async (teacher) => {
        const [courses] = await pool.query(
          'SELECT nombre FROM courses WHERE teacher_id = ?',
          [teacher.id]
        )
        return {
          ...teacher,
          cursos: courses.map(course => course.nombre)
        }
      })
    )
    return teachersWithCourses
  } catch (error) {
    console.error('Error al obtener docentes:', error)
    throw error
  }
}

// Agregar un nuevo docente
export const addTeacher = async (teacher) => {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()

    // Insertar docente
    const [result] = await connection.query(
      'INSERT INTO teachers (nombre, apellidos, dni, estado) VALUES (?, ?, ?, ?)',
      [teacher.nombre, teacher.apellidos, teacher.dni, teacher.estado]
    )

    // Insertar cursos
    const teacherId = result.insertId
    for (const curso of teacher.cursos) {
      await connection.query(
        'INSERT INTO courses (teacher_id, nombre) VALUES (?, ?)',
        [teacherId, curso]
      )
    }

    await connection.commit()
    return true
  } catch (error) {
    await connection.rollback()
    console.error('Error al agregar docente:', error)
    throw error
  } finally {
    connection.release()
  }
}

// Eliminar un docente
export const deleteTeacher = async (id) => {
  try {
    await pool.query('DELETE FROM teachers WHERE id = ?', [id])
    return true
  } catch (error) {
    console.error('Error al eliminar docente:', error)
    throw error
  }
}

// Actualizar un docente
export const updateTeacher = async (id, teacher) => {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()

    // Actualizar docente
    await connection.query(
      'UPDATE teachers SET nombre = ?, apellidos = ?, dni = ?, estado = ? WHERE id = ?',
      [teacher.nombre, teacher.apellidos, teacher.dni, teacher.estado, id]
    )

    // Eliminar cursos existentes
    await connection.query('DELETE FROM courses WHERE teacher_id = ?', [id])

    // Insertar nuevos cursos
    for (const curso of teacher.cursos) {
      await connection.query(
        'INSERT INTO courses (teacher_id, nombre) VALUES (?, ?)',
        [id, curso]
      )
    }

    await connection.commit()
    return true
  } catch (error) {
    await connection.rollback()
    console.error('Error al actualizar docente:', error)
    throw error
  } finally {
    connection.release()
  }
} 