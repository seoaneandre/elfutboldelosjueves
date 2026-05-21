# El Fútbol de los Jueves

Aplicación web para gestionar partidos de fútbol con sistema de valoración de jugadores.

## Características

- ✅ Gestión de usuarios (crear, editar, eliminar)
- ✅ Crear eventos (partidos) con participantes
- ✅ Sistema de valoración entre jugadores
- ✅ Historial de partidos y estadísticas

## Estructura del Proyecto

```
elfutboldelosjueves/
├── backend/          # API REST
│   ├── models/       # Modelos de datos
│   ├── routes/       # Rutas de API
│   ├── controllers/  # Controladores
│   └── app.js        # Configuración principal
├── frontend/         # Aplicación cliente
│   ├── src/
│   ├── public/
│   └── package.json
└── docs/            # Documentación
```

## Requisitos

- Node.js 16+
- MongoDB o PostgreSQL
- npm/yarn

## Instalación

```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm start
```

## API Endpoints

### Usuarios
- `POST /api/users` - Crear usuario
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Eventos/Partidos
- `POST /api/events` - Crear evento
- `GET /api/events` - Listar eventos
- `PUT /api/events/:id` - Actualizar evento
- `DELETE /api/events/:id` - Eliminar evento

### Valoraciones
- `POST /api/ratings` - Crear valoración
- `GET /api/ratings/:eventId` - Obtener valoraciones de evento
