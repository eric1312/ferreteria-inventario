const mongoose = require('mongoose');

// Subesquema para movimientos de stock
const MovimientoSchema = new mongoose.Schema({
  tipo: { 
    type: String, 
    enum: ['entrada', 'venta'], 
    required: true 
  },
  cantidad: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  fecha: { 
    type: Date, 
    default: Date.now 
  },
});

const ProductoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
    enum: ['herramientas', 'materiales', 'otros'], // Ejemplo de categorías
  },
  cantidad: {
    type: Number,
    required: true,
    min: 0,
  },
  precio: {
    type: Number,
    required: true,
    min: 0,
  },
  movimientos: [MovimientoSchema], // Historial de movimientos
}, { timestamps: true });

module.exports = mongoose.model('Producto', ProductoSchema);
