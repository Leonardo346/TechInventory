const express = require('express');
const { Op } = require('sequelize');
const Yup = require('yup');
const Product = require('../models/Product');

const router = express.Router();

const productSchema = Yup.object({
  nombre: Yup.string().required('El nombre es obligatorio'),
  categoria: Yup.string().required('La categoría es obligatoria'),
  precio: Yup.number().positive('El precio debe ser positivo').required(),
  stock: Yup.number().integer().min(0, 'El stock no puede ser negativo').required(),
});

// GET: Recuperar todos
router.get('/', async (req, res) => {
  try {
    const productos = await Product.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
  }
});

// POST: Crear nuevo
router.post('/', async (req, res) => {
  try {
    await productSchema.validate(req.body, { abortEarly: false });
    const nuevoProducto = await Product.create(req.body);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ errores: error.errors });
    res.status(500).json({ error: 'Error al crear' });
  }
});

// PUT: Actualizar
router.put('/:id', async (req, res) => {
  try {
    await productSchema.validate(req.body, { abortEarly: false });
    const producto = await Product.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: 'No encontrado' });

    await producto.update(req.body);
    res.status(200).json(producto);
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ errores: error.errors });
    res.status(500).json({ error: 'Error al actualizar' });
  }
});

// DELETE: Eliminar
router.delete('/:id', async (req, res) => {
  try {
    const producto = await Product.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: 'No encontrado' });

    await producto.destroy();
    res.status(200).json({ mensaje: 'Eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

module.exports = router;