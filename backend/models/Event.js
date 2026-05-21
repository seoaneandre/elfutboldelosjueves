const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del evento es requerido'],
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  fecha: {
    type: Date,
    required: [true, 'La fecha del evento es requerida']
  },
  lugar: {
    type: String,
    required: [true, 'El lugar es requerido']
  },
  organizador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participantes: [{
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    equipo: {
      type: String,
      enum: ['A', 'B'],
      required: true
    },
    asistencia: {
      type: Boolean,
      default: true
    }
  }],
  estado: {
    type: String,
    enum: ['programado', 'jugado', 'cancelado'],
    default: 'programado'
  },
  resultado: {
    golesEquipoA: { type: Number, default: 0 },
    golesEquipoB: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', eventSchema);