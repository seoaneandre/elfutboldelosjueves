const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  evento: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  evaluador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  evaluado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  puntuacion: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
    validate: {
      validator: Number.isInteger,
      message: 'La puntuación debe ser un número entero entre 1 y 10'
    }
  },
  comentario: {
    type: String,
    trim: true,
    maxlength: 500
  },
  aspecto: {
    type: String,
    enum: ['defensa', 'ataque', 'pases', 'resistencia', 'juego_en_equipo', 'general'],
    default: 'general'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Índice compuesto para evitar duplicados
ratingSchema.index({ evento: 1, evaluador: 1, evaluado: 1, aspecto: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);