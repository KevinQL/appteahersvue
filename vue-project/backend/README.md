# Backend de Gestión de Docentes

Este es el backend para la aplicación de gestión de docentes, desarrollado con Node.js y Express.

## Estructura del Proyecto

```
src/
├── config/         # Configuraciones (base de datos, etc.)
├── controllers/    # Controladores de la aplicación
├── middleware/     # Middleware (autenticación, etc.)
├── models/         # Modelos de datos
├── routes/         # Rutas de la API
├── services/       # Servicios de negocio
├── utils/          # Utilidades y helpers
└── app.js          # Punto de entrada de la aplicación
```

## Requisitos

- Node.js >= 14.x
- MySQL >= 5.7

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Crear archivo `.env` con las siguientes variables:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_password
   DB_NAME=teachers_db
   DB_PORT=3306
   JWT_SECRET=tu_clave_secreta
   PORT=3000
   ```

## Ejecución

Para desarrollo:
```bash
npm run dev
```

Para producción:
```bash
npm start
```

## API Endpoints

### Docentes

- `GET /api/teachers` - Obtener todos los docentes
- `POST /api/teachers` - Crear un nuevo docente
- `DELETE /api/teachers/:id` - Eliminar un docente

## Base de Datos

El sistema utiliza MySQL y crea automáticamente las siguientes tablas:

- `usuarios`: Almacena información de usuarios del sistema
- `teachers`: Almacena información de docentes
- `courses`: Almacena los cursos asociados a los docentes

## Seguridad

- Autenticación mediante JWT
- Contraseñas encriptadas con bcrypt
- Protección contra ataques comunes mediante middleware de Express 