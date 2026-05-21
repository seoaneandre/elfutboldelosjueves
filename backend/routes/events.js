const express = require('express');
const { body, validationResult } = require('express-validator');
const Event = require('../models/Event');
const User = require('../models/User');
const router = express.Router();

// Middleware para validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// POST - Crear evento
router.post('/', [
  body('nombre').notEmpty().withMessage('El nombre del evento es requerido'),
  body('fecha').isISO8601().withMessage('Fecha inválida'),
  body('lugar').notEmpty().withMessage('El lugar es requerido'),
  body('organizador').isMongoId().withMessage('ID de organizador inválido')
], handleValidationErrors, async (req, res) => {
  try {
    const { nombre, descripcion, fecha, lugar, organizador, participantes } = req.body;

    // Verificar que el organizador existe
    const usuario = await User.findById(organizador);
    if (!usuario) {
      return res.status(404).json({ error: 'Organizador no encontrado' });
    }

    const evento = new Event({
      nombre,
      descripcion,
      fecha: new Date(fecha),
      lugar,
      organizador,
      participantes: participantes || []
    });

    await evento.save();
    await evento.populate('organizador', 'nombre apellido email');

    res.status(201).json({
      mensaje: 'Evento creado exitosamente',
      evento
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - Obtener todos los eventos
router.get('/', async (req, res) => {
  try {
    const eventos = await Event.find()
      .populate('organizador', 'nombre apellido email')
      .populate('participantes.usuario', 'nombre apellido email')
      .sort({ fecha: -1 });
    
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - Obtener evento por ID
router.get('/:id', async (req, res) => {
  try {
    const evento = await Event.findById(req.params.id)
      .populate('organizador', 'nombre apellido email')
      .populate('participantes.usuario', 'nombre apellido email estadisticas');
    
    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    res.json(evento);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT - Actualizar evento
router.put('/:id', async (req, res) => {
  try {
    const { nombre, descripcion, fecha, lugar, participantes, estado, resultado } = req.body;

    const evento = await Event.findByIdAndUpdate(
      req.params.id,
      {
        nombre,
        descripcion,
        fecha: fecha ? new Date(fecha) : undefined,
        lugar,
        participantes,
        estado,
        resultado,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).populate('organizador', 'nombre apellido email')
     .populate('participantes.usuario', 'nombre apellido email');

    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    res.json({
      mensaje: 'Evento actualizado exitosamente',
      evento
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - Añadir participante a evento
router.post('/:id/participantes', [
  body('usuarioId').isMongoId().withMessage('ID de usuario inválido'),
  body('equipo').isIn(['A', 'B']).withMessage('Equipo debe ser A o B')
], handleValidationErrors, async (req, res) => {
  try {
    const { usuarioId, equipo } = req.body;

    // Verificar que el usuario existe
    const usuario = await User.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const evento = await Event.findById(req.params.id);
    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    // Verificar que el usuario no está ya en el evento
    const yaParticipa = evento.participantes.some(p => p.usuario.toString() === usuarioId);
    if (yaParticipa) {
      return res.status(400).json({ error: 'El usuario ya es participante en este evento' });
    }

    evento.participantes.push({ usuario: usuarioId, equipo });
    await evento.save();

    await evento.populate('participantes.usuario', 'nombre apellido email');

    res.json({
      mensaje: 'Participante añadido exitosamente',
      evento
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - Eliminar evento
router.delete('/:id', async (req, res) => {
  try {
    const evento = await Event.findByIdAndDelete(req.params.id);

    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    res.json({ mensaje: 'Evento eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;