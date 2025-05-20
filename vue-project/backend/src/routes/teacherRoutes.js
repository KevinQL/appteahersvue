const express = require('express')
const router = express.Router()
const teacherController = require('../controllers/teacherController')
const { authenticateToken } = require('../middleware/auth')

router.get('/', authenticateToken, teacherController.getAllTeachers)
router.post('/', authenticateToken, teacherController.createTeacher)
router.delete('/:id', authenticateToken, teacherController.deleteTeacher)

module.exports = router 