const express = require('express');
const Producto = require('../models/Producto');

const router = express.Router();

// Obtener todos los productos o buscar por categoría
router.get('/', async (req, res) => {
  const { categoria } = req.query; // Filtrar por categoría si se especifica
  try {
    const productos = categoria
      ? await Producto.find({ categoria })
      : await Producto.find();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los productos', error: err });
  }
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
  const { nombre, descripcion, categoria, cantidad, precio } = req.body;

  if (cantidad < 0 || precio < 0) {
    return res.status(400).json({ message: 'Cantidad y precio deben ser positivos' });
  }

  try {
    const nuevoProducto = new Producto({ nombre, descripcion, categoria, cantidad, precio });
    const productoGuardado = await nuevoProducto.save();
    res.status(201).json(productoGuardado);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el producto', error: err });
  }
});

// Registrar un movimiento de stock
router.post('/:id/movimientos', async (req, res) => {
  const { id } = req.params;
  const { tipo, cantidad } = req.body;

  if (cantidad <= 0) {
    return res.status(400).json({ message: 'La cantidad debe ser mayor a 0' });
  }

  try {
    const producto = await Producto.findById(id);

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    if (tipo === 'venta' && producto.cantidad < cantidad) {
      return res.status(400).json({ message: 'Stock insuficiente' });
    }

    // Actualizar cantidad en el inventario
    producto.cantidad += tipo === 'entrada' ? cantidad : -cantidad;

    // Registrar el movimiento
    producto.movimientos.push({ tipo, cantidad });
    const productoActualizado = await producto.save();

    res.json(productoActualizado);
  } catch (err) {
    res.status(500).json({ message: 'Error al registrar el movimiento', error: err });
  }
});

// Actualizar un producto
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, categoria, cantidad, precio } = req.body;

  if (cantidad < 0 || precio < 0) {
    return res.status(400).json({ message: 'Cantidad y precio deben ser positivos' });
  }

  try {
    const productoActualizado = await Producto.findByIdAndUpdate(
      id,
      { nombre, descripcion, categoria, cantidad, precio },
      { new: true }
    );
    res.json(productoActualizado);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el producto', error: err });
  }
});

// Eliminar un producto
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Producto.findByIdAndDelete(id);
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el producto', error: err });
  }
});

module.exports = router;
