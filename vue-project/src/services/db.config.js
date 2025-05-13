import mysql from 'mysql2/promise'

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Agrega tu contraseña si es necesario
  database: 'teachers_db',
  port: 3306
}

// Crear el pool de conexiones
const pool = mysql.createPool(dbConfig)

// Función para probar la conexión
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection()
    console.log('Conexión exitosa a la base de datos')
    connection.release()
    return true
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error)
    return false
  }
}

export default pool 