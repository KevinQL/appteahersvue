const express = require('express')
const cors = require('cors')
const teacherRoutes = require('./routes/teacherRoutes')
const initDatabase = require('./utils/databaseInit')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Rutas
app.use('/api/teachers', teacherRoutes)

// Inicializar la base de datos
initDatabase()

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)
})

module.exports = app 