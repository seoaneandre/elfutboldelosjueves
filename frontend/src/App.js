import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [currentView, setCurrentView] = useState('home');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarUsuarios();
    cargarEventos();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/users`);
      setUsuarios(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar usuarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cargarEventos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events`);
      setEventos(response.data);
    } catch (err) {
      console.error('Error al cargar eventos:', err);
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <h1>⚽ El Fútbol de los Jueves</h1>
        <div className="nav-links">
          <button onClick={() => setCurrentView('home')}>Inicio</button>
          <button onClick={() => setCurrentView('usuarios')}>Usuarios</button>
          <button onClick={() => setCurrentView('eventos')}>Eventos</button>
          <button onClick={() => setCurrentView('valoraciones')}>Valoraciones</button>
        </div>
      </nav>

      <main className="container">
        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading">Cargando...</div>}

        {currentView === 'home' && <Home usuariosCount={usuarios.length} eventosCount={eventos.length} />}
        {currentView === 'usuarios' && <Usuarios usuarios={usuarios} onRefresh={cargarUsuarios} />}
        {currentView === 'eventos' && <Eventos eventos={eventos} usuarios={usuarios} onRefresh={cargarEventos} />}
        {currentView === 'valoraciones' && <Valoraciones eventos={eventos} usuarios={usuarios} />}
      </main>
    </div>
  );
}

function Home({ usuariosCount, eventosCount }) {
  return (
    <div className="home">
      <h2>Bienvenido a El Fútbol de los Jueves</h2>
      <div className="stats">
        <div className="stat-card">
          <h3>{usuariosCount}</h3>
          <p>Jugadores Registrados</p>
        </div>
        <div className="stat-card">
          <h3>{eventosCount}</h3>
          <p>Partidos</p>
        </div>
      </div>
    </div>
  );
}

function Usuarios({ usuarios, onRefresh }) {
  const [formData, setFormData] = useState({ nombre: '', apellido: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await axios.post(`${API_BASE_URL}/users`, formData);
      setFormData({ nombre: '', apellido: '', email: '', password: '' });
      onRefresh();
      alert('Usuario creado exitosamente');
    } catch (err) {
      alert('Error al crear usuario: ' + err.response?.data?.error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="usuarios-view">
      <h2>Gestión de Usuarios</h2>
      
      <form className="form" onSubmit={handleSubmit}>
        <h3>Crear Nuevo Usuario</h3>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={formData.apellido}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Creando...' : 'Crear Usuario'}
        </button>
      </form>

      <div className="usuarios-list">
        <h3>Usuarios Registrados</h3>
        {usuarios.length === 0 ? (
          <p>No hay usuarios registrados</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Valoración</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(usuario => (
                <tr key={usuario._id}>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.apellido}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.estadisticas?.valoracionPromedio || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Eventos({ eventos, usuarios, onRefresh }) {
  const [formData, setFormData] = useState({ nombre: '', lugar: '', fecha: '', organizador: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await axios.post(`${API_BASE_URL}/events`, formData);
      setFormData({ nombre: '', lugar: '', fecha: '', organizador: '' });
      onRefresh();
      alert('Evento creado exitosamente');
    } catch (err) {
      alert('Error al crear evento: ' + err.response?.data?.error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="eventos-view">
      <h2>Gestión de Eventos</h2>
      
      <form className="form" onSubmit={handleSubmit}>
        <h3>Crear Nuevo Evento</h3>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del Evento"
          value={formData.nombre}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="lugar"
          placeholder="Lugar"
          value={formData.lugar}
          onChange={handleInputChange}
          required
        />
        <input
          type="datetime-local"
          name="fecha"
          value={formData.fecha}
          onChange={handleInputChange}
          required
        />
        <select
          name="organizador"
          value={formData.organizador}
          onChange={handleInputChange}
          required
        >
          <option value="">Seleccionar Organizador</option>
          {usuarios.map(usuario => (
            <option key={usuario._id} value={usuario._id}>
              {usuario.nombre} {usuario.apellido}
            </option>
          ))}
        </select>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Creando...' : 'Crear Evento'}
        </button>
      </form>

      <div className="eventos-list">
        <h3>Próximos Eventos</h3>
        {eventos.length === 0 ? (
          <p>No hay eventos registrados</p>
        ) : (
          <div className="eventos-grid">
            {eventos.map(evento => (
              <div key={evento._id} className="evento-card">
                <h4>{evento.nombre}</h4>
                <p><strong>Lugar:</strong> {evento.lugar}</p>
                <p><strong>Fecha:</strong> {new Date(evento.fecha).toLocaleDateString()}</p>
                <p><strong>Participantes:</strong> {evento.participantes?.length || 0}</p>
                <p><strong>Estado:</strong> {evento.estado}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Valoraciones({ eventos, usuarios }) {
  const [selectedEvento, setSelectedEvento] = useState('');
  const [valoraciones, setValoraciones] = useState([]);
  const [formData, setFormData] = useState({ evaluador: '', evaluado: '', puntuacion: 5, aspecto: 'general' });

  const cargarValoraciones = async (eventoId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ratings/evento/${eventoId}`);
      setValoraciones(response.data);
    } catch (err) {
      console.error('Error al cargar valoraciones:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/ratings`, {
        ...formData,
        evento: selectedEvento,
        puntuacion: parseInt(formData.puntuacion)
      });
      setFormData({ evaluador: '', evaluado: '', puntuacion: 5, aspecto: 'general' });
      cargarValoraciones(selectedEvento);
      alert('Valoración registrada');
    } catch (err) {
      alert('Error: ' + err.response?.data?.error);
    }
  };

  return (
    <div className="valoraciones-view">
      <h2>Sistema de Valoraciones</h2>
      
      <div>
        <select value={selectedEvento} onChange={(e) => {
          setSelectedEvento(e.target.value);
          if (e.target.value) cargarValoraciones(e.target.value);
        }}>
          <option value="">Seleccionar Evento</option>
          {eventos.map(evento => (
            <option key={evento._id} value={evento._id}>
              {evento.nombre}
            </option>
          ))}
        </select>
      </div>

      {selectedEvento && (
        <>
          <form className="form" onSubmit={handleSubmit}>
            <h3>Nueva Valoración</h3>
            <select name="evaluador" value={formData.evaluador} onChange={handleInputChange} required>
              <option value="">Seleccionar Evaluador</option>
              {usuarios.map(u => (
                <option key={u._id} value={u._id}>{u.nombre} {u.apellido}</option>
              ))}
            </select>
            <select name="evaluado" value={formData.evaluado} onChange={handleInputChange} required>
              <option value="">Seleccionar Jugador a Valorar</option>
              {usuarios.map(u => (
                <option key={u._id} value={u._id}>{u.nombre} {u.apellido}</option>
              ))}
            </select>
            <input type="range" name="puntuacion" min="1" max="10" value={formData.puntuacion} onChange={handleInputChange} />
            <span>Puntuación: {formData.puntuacion}</span>
            <select name="aspecto" value={formData.aspecto} onChange={handleInputChange}>
              <option value="general">General</option>
              <option value="defensa">Defensa</option>
              <option value="ataque">Ataque</option>
              <option value="pases">Pases</option>
              <option value="resistencia">Resistencia</option>
              <option value="juego_en_equipo">Juego en Equipo</option>
            </select>
            <button type="submit">Registrar Valoración</button>
          </form>

          <div className="valoraciones-list">
            <h3>Valoraciones del Evento</h3>
            {valoraciones.length === 0 ? (
              <p>No hay valoraciones</p>
            ) : (
              <ul>
                {valoraciones.map(v => (
                  <li key={v._id}>
                    <strong>{v.evaluador?.nombre}</strong> valoró a <strong>{v.evaluado?.nombre}</strong>: <strong>{v.puntuacion}/10</strong> ({v.aspecto})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;