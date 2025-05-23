const mysql = require('mysql2/promise')
require('dotenv').config()

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'teachers_db',
  port: process.env.DB_PORT || 3306
}

const pool = mysql.createPool(dbConfig)

module.exports = pool 