-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS teachers_db;
USE teachers_db;

-- Tabla de usuarios de administración
CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'asistente', 'tecnico') NOT NULL,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    ultimo_acceso DATETIME,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    token_recuperacion VARCHAR(255),
    token_expiracion DATETIME,
    intentos_fallidos INT DEFAULT 0,
    bloqueado BOOLEAN DEFAULT FALSE,
    ultimo_cambio_password DATETIME,
    CONSTRAINT email_unico UNIQUE (email)
);

-- Tabla de docentes (teachers)
CREATE TABLE IF NOT EXISTS teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    dni VARCHAR(20) NOT NULL UNIQUE,
    estado ENUM('activo', 'inactivo') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_creacion INT,
    usuario_actualizacion INT,
    FOREIGN KEY (usuario_creacion) REFERENCES usuarios(id),
    FOREIGN KEY (usuario_actualizacion) REFERENCES usuarios(id)
);

-- Tabla de cursos (courses)
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT,
    nombre VARCHAR(100) NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    usuario_creacion INT,
    usuario_actualizacion INT,
    FOREIGN KEY (usuario_creacion) REFERENCES usuarios(id),
    FOREIGN KEY (usuario_actualizacion) REFERENCES usuarios(id)
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_usuarios_estado ON usuarios(estado);

CREATE INDEX idx_teachers_dni ON teachers(dni);
CREATE INDEX idx_teachers_estado ON teachers(estado);

-- Insertar usuario administrador por defecto (password: Admin123!)
INSERT INTO usuarios (nombre, apellidos, email, password, rol, estado)
VALUES (
    'Administrador',
    'Sistema',
    'admin@sistema.com',
    '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX5YxX', -- Este es un hash de ejemplo, debe ser reemplazado
    'admin',
    'activo'
);

-- Triggers para auditoría
DELIMITER //

CREATE TRIGGER before_teacher_update
BEFORE UPDATE ON teachers
FOR EACH ROW
BEGIN
    SET NEW.created_at = CURRENT_TIMESTAMP;
END//

DELIMITER ; 