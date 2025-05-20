const Teacher = require('../models/Teacher')
const pool = require('../config/database')

const teacherController = {
  async getAllTeachers(req, res) {
    try {
      const teachers = await Teacher.findAll()
      const teachersWithCourses = await Promise.all(
        teachers.map(async (teacher) => {
          const courses = await Teacher.getCourses(teacher.id)
          return {
            ...teacher,
            cursos: courses
          }
        })
      )
      res.json(teachersWithCourses)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async createTeacher(req, res) {
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()

      const { nombre, apellidos, dni, estado, cursos } = req.body
      const teacherId = await Teacher.create({ nombre, apellidos, dni, estado })
      await Teacher.addCourses(teacherId, cursos)

      await connection.commit()
      res.json({ message: 'Docente agregado correctamente' })
    } catch (error) {
      await connection.rollback()
      res.status(500).json({ error: error.message })
    } finally {
      connection.release()
    }
  },

  async deleteTeacher(req, res) {
    try {
      await Teacher.delete(req.params.id)
      res.json({ message: 'Docente eliminado correctamente' })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}

module.exports = teacherController 