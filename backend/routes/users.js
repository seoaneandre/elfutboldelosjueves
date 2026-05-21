const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();

// Middleware para validación de errores
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// POST - Crear nuevo usuario
router.post('/', [
  body('nombre').notEmpty().withMessage('El nombre es requerido').trim(),
  body('apellido').notEmpty().withMessage('El apellido es requerido').trim(),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], handleValidationErrors, async (req, res) => {
  try {
    const { nombre, apellido, email, password } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const usuario = new User({ nombre, apellido, email, password });
    await usuario.save();

    res.status(201).json({
      mensaje: 'Usuario creado exitosamente',
      usuario: usuario.toJSON()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await User.find({ activo: true }).select('-password');
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - Obtener usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id).select('-password');
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT - Actualizar usuario
router.put('/:id', [
  body('nombre').optional().trim(),
  body('apellido').optional().trim(),
  body('email').optional().isEmail().withMessage('Email inválido')
], handleValidationErrors, async (req, res) => {
  try {
    const { nombre, apellido, email, activo } = req.body;
    
    const usuario = await User.findByIdAndUpdate(
      req.params.id,
      { nombre, apellido, email, activo, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).select('-password');

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      mensaje: 'Usuario actualizado exitosamente',
      usuario
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - Desactivar usuario (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const usuario = await User.findByIdAndUpdate(
      req.params.id,
      { activo: false, updatedAt: Date.now() },
      { new: true }
    );

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario desactivado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;