# Guía Completa - El Fútbol de los Jueves

## Tabla de Contenidos
1. [Instalación](#instalación)
2. [Configuración](#configuración)
3. [API Endpoints](#api-endpoints)
4. [Modelos de Datos](#modelos-de-datos)
5. [Flujo de Uso](#flujo-de-uso)
6. [Troubleshooting](#troubleshooting)

## Instalación

### Requisitos Previos
- Node.js v16 o superior
- npm o yarn
- MongoDB instalado localmente o cuenta en MongoDB Atlas

### Backend

```bash
cd backend

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env

# Editar .env con configuraciones
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/elfutboldelosjueves
# JWT_SECRET=tu_secret_key
# NODE_ENV=development
# CORS_ORIGIN=http://localhost:3000

# Iniciar en desarrollo
npm run dev

# O iniciar en producción
npm start
```

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Crear .env si no existe
# REACT_APP_API_URL=http://localhost:5000/api

# Iniciar desarrollo
npm start

# Build para producción
npm run build
```

## Configuración

### Variables de Entorno - Backend

| Variable | Descripción | Default |
|----------|-------------|---------|
| PORT | Puerto del servidor | 5000 |
| MONGODB_URI | URI de conexión a MongoDB | mongodb://localhost:27017/elfutboldelosjueves |
| JWT_SECRET | Secret para tokens JWT | tu_secret_key |
| NODE_ENV | Ambiente (development/production) | development |
| CORS_ORIGIN | URL permitida para CORS | http://localhost:3000 |

### Variables de Entorno - Frontend

| Variable | Descripción | Default |
|----------|-------------|---------|
| REACT_APP_API_URL | URL de la API backend | http://localhost:5000/api |

## API Endpoints

### 👥 Usuarios

#### Crear Usuario
```
POST /api/users
Content-Type: application/json

{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@example.com",
  "password": "password123"
}

Response 201:
{
  "mensaje": "Usuario creado exitosamente",
  "usuario": {
    "_id": "...",
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "estadisticas": {...}
  }
}
```

#### Obtener Todos los Usuarios
```
GET /api/users

Response 200: [
  {
    "_id": "...",
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "activo": true,
    "estadisticas": {...}
  }
]
```

#### Obtener Usuario por ID
```
GET /api/users/:id

Response 200: {...usuario...}
```

#### Actualizar Usuario
```
PUT /api/users/:id
Content-Type: application/json

{
  "nombre": "Juan",
  "apellido": "García"
}

Response 200: {...usuario actualizado...}
```

#### Desactivar Usuario
```
DELETE /api/users/:id

Response 200: {
  "mensaje": "Usuario desactivado exitosamente"
}
```

### ⚽ Eventos

#### Crear Evento
```
POST /api/events
Content-Type: application/json

{
  "nombre": "Partido del Jueves",
  "descripcion": "Amistoso",
  "fecha": "2026-05-28T19:00:00Z",
  "lugar": "Cancha Municipal",
  "organizador": "user_id_here",
  "participantes": []
}

Response 201: {...evento...}
```

#### Obtener Eventos
```
GET /api/events

Response 200: [
  {
    "_id": "...",
    "nombre": "Partido del Jueves",
    "fecha": "2026-05-28T19:00:00Z",
    "lugar": "Cancha Municipal",
    "participantes": [...],
    "estado": "programado"
  }
]
```

#### Añadir Participante
```
POST /api/events/:id/participantes
Content-Type: application/json

{
  "usuarioId": "user_id",
  "equipo": "A"
}

Response 200: {...evento con nuevo participante...}
```

### 🏆 Valoraciones

#### Crear Valoración
```
POST /api/ratings
Content-Type: application/json

{
  "evento": "event_id",
  "evaluador": "user_evaluador_id",
  "evaluado": "user_evaluado_id",
  "puntuacion": 8,
  "aspecto": "general",
  "comentario": "Excelente defensa"
}

Response 201: {...valoración...}
```

#### Obtener Valoraciones de Evento
```
GET /api/ratings/evento/:eventoId

Response 200: [
  {
    "_id": "...",
    "evaluador": {...},
    "evaluado": {...},
    "puntuacion": 8,
    "aspecto": "general"
  }
]
```

#### Obtener Valoraciones de Usuario
```
GET /api/ratings/usuario/:usuarioId

Response 200: {
  "usuario": "user_id",
  "estadisticas": {
    "totalValoraciones": 5,
    "puntuacionPromedio": 7.8,
    "porAspecto": {
      "defensa": 8.2,
      "ataque": 7.5,
      ...
    }
  },
  "valoraciones": [...]
}
```

## Modelos de Datos

### Usuario
```javascript
{
  _id: ObjectId,
  nombre: String (2+ caracteres),
  apellido: String (2+ caracteres),
  email: String (único, válido),
  password: String (hasheada),
  numeroJugador: Number,
  activo: Boolean,
  estadisticas: {
    partidosJugados: Number,
    valoracionPromedio: Number,
    goles: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Evento
```javascript
{
  _id: ObjectId,
  nombre: String,
  descripcion: String,
  fecha: Date,
  lugar: String,
  organizador: ObjectId (ref: User),
  participantes: [
    {
      usuario: ObjectId (ref: User),
      equipo: String ('A' o 'B'),
      asistencia: Boolean
    }
  ],
  estado: String ('programado', 'jugado', 'cancelado'),
  resultado: {
    golesEquipoA: Number,
    golesEquipoB: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Valoración
```javascript
{
  _id: ObjectId,
  evento: ObjectId (ref: Event),
  evaluador: ObjectId (ref: User),
  evaluado: ObjectId (ref: User),
  puntuacion: Number (1-10),
  comentario: String (0-500 caracteres),
  aspecto: String ('defensa', 'ataque', 'pases', 'resistencia', 'juego_en_equipo', 'general'),
  createdAt: Date
}
```

## Flujo de Uso

### 1. Crear Usuarios
```
POST /api/users con los datos del jugador
```

### 2. Crear Evento
```
POST /api/events con el nombre, lugar, fecha y organizador
```

### 3. Añadir Participantes
```
POST /api/events/:id/participantes para cada jugador
```

### 4. Jugar el Partido
- Actualizar estado a "jugado"
- Registrar goles

### 5. Valorar Jugadores
```
POST /api/ratings para cada valoración
```

### 6. Ver Estadísticas
```
GET /api/ratings/usuario/:id para ver desempeño
```

## Troubleshooting

### Error: "Cannot connect to MongoDB"
- Verifica que MongoDB está corriendo
- Revisa la URI en .env
- Intenta con: `mongodb://localhost:27017/`

### Error: "Port already in use"
- Backend: Cambia PORT en .env
- Frontend: `PORT=3001 npm start`

### Error: "CORS error"
- Revisa CORS_ORIGIN en backend/.env
- Debe coincidir con la URL del frontend

### Error: "Validación falló"
- Revisa que los datos cumplan con los requisitos
- Usa Postman para probar primero

### La app no carga
- Verifica que backend está en http://localhost:5000
- Revisa la consola del navegador
- Revisa los logs del servidor

## Seguridad

- ✅ Contraseñas hasheadas con bcryptjs
- ✅ Validación de entrada en servidor
- ✅ CORS configurado
- ✅ Soft delete para preservar datos
- ✅ Índices únicos en campos sensibles
