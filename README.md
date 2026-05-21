# El Fútbol de los Jueves

Aplicación web completa para gestionar partidos de fútbol con sistema de valoración de jugadores.

## 🎯 Características Principales

### 👥 Gestión de Usuarios
- ✅ Crear nuevos usuarios con nombre, apellido y email
- ✅ Validación de datos en tiempo real
- ✅ Editar información de usuarios
- ✅ Desactivar usuarios (soft delete)
- ✅ Ver lista de jugadores con estadísticas

### ⚽ Gestión de Eventos (Partidos)
- ✅ Crear eventos con fecha, lugar y participantes
- ✅ Asignar jugadores a equipos (A/B)
- ✅ Registrar resultados y goles
- ✅ Cambiar estado del evento (programado, jugado, cancelado)
- ✅ Ver historial de eventos

### 🏆 Sistema de Valoración
- ✅ Valorar a jugadores después de cada partido
- ✅ Puntuación de 1-10
- ✅ Evaluar diferentes aspectos (defensa, ataque, pases, resistencia, juego en equipo, general)
- ✅ Ver estadísticas de desempeño
- ✅ Historial de valoraciones

## 📁 Estructura del Proyecto

```
backend/                 # API REST con Node.js
├── models/             # Esquemas MongoDB
├── routes/             # Rutas de API
├── app.js              # Configuración principal
└── package.json

frontend/                # Aplicación React
├── src/
│   ├── App.js
│   ├── index.js
│   └── styles/
├── public/
└── package.json
```

## 🚀 Guía Rápida

### Instalación Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Instalación Frontend
```bash
cd frontend
npm install
npm start
```

## 📚 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/users | Crear usuario |
| GET | /api/users | Listar usuarios |
| GET | /api/users/:id | Obtener usuario |
| PUT | /api/users/:id | Actualizar usuario |
| DELETE | /api/users/:id | Desactivar usuario |
| POST | /api/events | Crear evento |
| GET | /api/events | Listar eventos |
| POST | /api/ratings | Crear valoración |
| GET | /api/ratings/usuario/:id | Ver valoraciones |

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- bcryptjs (seguridad)
- express-validator (validación)

**Frontend:**
- React 18
- Axios (HTTP client)
- CSS3 (diseño responsivo)

## 📖 Documentación

Para documentación más detallada, ver:
- Backend: `backend/package.json`
- Frontend: `frontend/README.md`

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor abre un issue o pull request.

## 📄 Licencia

MIT

---

**Desarrollado por:** seoaneandre
