const jwt = require('jsonwebtoken')
const pool = require('../config/database')

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

module.exports = {
  authenticateToken
} 