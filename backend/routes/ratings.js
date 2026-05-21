const express = require('express');
const { body, validationResult } = require('express-validator');
const Rating = require('../models/Rating');
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

// POST - Crear valoración
router.post('/', [
  body('evento').isMongoId().withMessage('ID de evento inválido'),
  body('evaluador').isMongoId().withMessage('ID de evaluador inválido'),
  body('evaluado').isMongoId().withMessage('ID de evaluado inválido'),
  body('puntuacion').isInt({ min: 1, max: 10 }).withMessage('Puntuación debe estar entre 1 y 10'),
  body('aspecto').isIn(['defensa', 'ataque', 'pases', 'resistencia', 'juego_en_equipo', 'general']).withMessage('Aspecto inválido')
], handleValidationErrors, async (req, res) => {
  try {
    const { evento, evaluador, evaluado, puntuacion, comentario, aspecto } = req.body;

    // Verificar que no sea autovaloración
    if (evaluador === evaluado) {
      return res.status(400).json({ error: 'No puedes valorarte a ti mismo' });
    }

    // Verificar que el evento existe
    const eventoDoc = await Event.findById(evento);
    if (!eventoDoc) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    // Verificar que ambos usuarios participaron en el evento
    const evaluadorParticipa = eventoDoc.participantes.some(p => p.usuario.toString() === evaluador);
    const evaluadoParticipa = eventoDoc.participantes.some(p => p.usuario.toString() === evaluado);

    if (!evaluadorParticipa || !evaluadoParticipa) {
      return res.status(400).json({ error: 'Ambos usuarios deben haber participado en el evento' });
    }

    const valoracion = new Rating({
      evento,
      evaluador,
      evaluado,
      puntuacion,
      comentario,
      aspecto
    });

    await valoracion.save();

    // Actualizar estadísticas del usuario evaluado
    await actualizarEstadisticas(evaluado);

    await valoracion.populate('evaluador', 'nombre apellido');
    await valoracion.populate('evaluado', 'nombre apellido');

    res.status(201).json({
      mensaje: 'Valoración creada exitosamente',
      valoracion
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Ya has valorado este aspecto de este jugador en este evento' });
    }
    res.status(500).json({ error: err.message });
  }
});

// GET - Obtener valoraciones por evento
router.get('/evento/:eventoId', async (req, res) => {
  try {
    const valoraciones = await Rating.find({ evento: req.params.eventoId })
      .populate('evaluador', 'nombre apellido')
      .populate('evaluado', 'nombre apellido')
      .sort({ createdAt: -1 });

    res.json(valoraciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - Obtener valoraciones de un usuario
router.get('/usuario/:usuarioId', async (req, res) => {
  try {
    const valoraciones = await Rating.find({ evaluado: req.params.usuarioId })
      .populate('evaluador', 'nombre apellido')
      .populate('evento', 'nombre fecha')
      .sort({ createdAt: -1 });

    // Calcular estadísticas
    const stats = {
      totalValoraciones: valoraciones.length,
      puntuacionPromedio: 0,
      porAspecto: {}
    };

    if (valoraciones.length > 0) {
      stats.puntuacionPromedio = (valoraciones.reduce((sum, v) => sum + v.puntuacion, 0) / valoraciones.length).toFixed(2);

      // Agrupar por aspecto
      const aspectos = ['defensa', 'ataque', 'pases', 'resistencia', 'juego_en_equipo', 'general'];
      aspectos.forEach(aspecto => {
        const valoracionesAspecto = valoraciones.filter(v => v.aspecto === aspecto);
        if (valoracionesAspecto.length > 0) {
          stats.porAspecto[aspecto] = (
            valoracionesAspecto.reduce((sum, v) => sum + v.puntuacion, 0) / valoracionesAspecto.length
          ).toFixed(2);
        }
      });
    }

    res.json({
      usuario: req.params.usuarioId,
      estadisticas: stats,
      valoraciones
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Función auxiliar para actualizar estadísticas del usuario
async function actualizarEstadisticas(usuarioId) {
  try {
    const valoraciones = await Rating.find({ evaluado: usuarioId });
    
    if (valoraciones.length > 0) {
      const promedio = valoraciones.reduce((sum, v) => sum + v.puntuacion, 0) / valoraciones.length;
      
      await User.findByIdAndUpdate(
        usuarioId,
        { 'estadisticas.valoracionPromedio': parseFloat(promedio.toFixed(2)) },
        { new: true }
      );
    }
  } catch (err) {
    console.error('Error actualizando estadísticas:', err);
  }
}

module.exports = router;