const pool = require('../config/database')

class Teacher {
  static async findAll() {
    const [teachers] = await pool.query('SELECT * FROM teachers')
    return teachers
  }

  static async findById(id) {
    const [teachers] = await pool.query('SELECT * FROM teachers WHERE id = ?', [id])
    return teachers[0]
  }

  static async create(teacherData) {
    const { nombre, apellidos, dni, estado } = teacherData
    const [result] = await pool.query(
      'INSERT INTO teachers (nombre, apellidos, dni, estado) VALUES (?, ?, ?, ?)',
      [nombre, apellidos, dni, estado]
    )
    return result.insertId
  }

  static async delete(id) {
    await pool.query('DELETE FROM teachers WHERE id = ?', [id])
  }

  static async getCourses(teacherId) {
    const [courses] = await pool.query(
      'SELECT nombre FROM courses WHERE teacher_id = ?',
      [teacherId]
    )
    return courses.map(course => course.nombre)
  }

  static async addCourses(teacherId, courses) {
    for (const curso of courses) {
      await pool.query(
        'INSERT INTO courses (teacher_id, nombre) VALUES (?, ?)',
        [teacherId, curso]
      )
    }
  }
}

module.exports = Teacher 