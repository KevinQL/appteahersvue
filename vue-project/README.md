# Sistema de Gestión de Docentes

Aplicación web desarrollada con Vue.js 3 y Node.js para la gestión de docentes y sus cursos.

## 🚀 Características Implementadas

### Frontend (Vue.js 3)
- Formulario de registro de docentes con los siguientes campos:
  - Nombre
  - Apellidos
  - DNI
  - Estado (activo/inactivo)
  - Cursos (múltiples)
- Lista de docentes con sus cursos
- Funcionalidad para eliminar docentes
- Comunicación con el backend mediante API REST

### Backend (Node.js + Express)
- API REST para gestión de docentes
- Conexión a base de datos MySQL
- Endpoints implementados:
  - GET /api/teachers: Obtener todos los docentes
  - POST /api/teachers: Crear nuevo docente
  - DELETE /api/teachers/:id: Eliminar docente

## 🛠️ Tecnologías Utilizadas

### Frontend
- Vue.js 3
- Vite
- Axios
- CSS3

### Backend
- Node.js
- Express
- MySQL
- CORS
- dotenv

## 📋 Requisitos Previos

- Node.js (versión 14 o superior)
- MySQL Server
- npm o yarn

## 🔧 Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
```

2. Instalar dependencias del frontend:
```bash
cd vue-project
npm install
```

3. Instalar dependencias del backend:
```bash
cd backend
npm install
```

4. Configurar variables de entorno:
   - Crear archivo `.env` en la carpeta `backend` con las siguientes variables:
   ```
   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=teachers_db
   DB_PORT=3306
   PORT=3000
   ```

## 🚀 Ejecución

1. Iniciar el backend:
```bash
cd backend
npm run dev
```

2. Iniciar el frontend:
```bash
cd vue-project
npm run dev
```

## 📝 Pendientes por Implementar

### Frontend
- [ ] Implementar edición de docentes
- [ ] Agregar validaciones de formulario más robustas
- [ ] Implementar mensajes de feedback para el usuario
- [ ] Agregar confirmación antes de eliminar docentes
- [ ] Implementar paginación en la lista de docentes
- [ ] Agregar filtros de búsqueda
- [ ] Mejorar el diseño responsive

### Backend
- [ ] Implementar endpoint para actualizar docentes
- [ ] Agregar validaciones de datos
- [ ] Implementar autenticación y autorización
- [ ] Agregar logging de operaciones
- [ ] Implementar manejo de errores más robusto
- [ ] Agregar tests unitarios y de integración

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.
