import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [ordenarPor, setOrdenarPor] = useState('');
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    descripcion: '',
    cantidad: '',
    precio: '',
  });

  // Cargar productos desde el backend
  useEffect(() => {
    fetch('http://localhost:5000/api/productos')
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error(err));
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setNuevoProducto({
      ...nuevoProducto,
      [e.target.name]: e.target.value,
    });
  };

  // Agregar un nuevo producto
  const handleAgregarProducto = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoProducto),
    })
      .then((res) => res.json())
      .then((data) => {
        setProductos([...productos, data]);
        setNuevoProducto({ nombre: '', descripcion: '', cantidad: '', precio: '' });
      })
      .catch((err) => console.error(err));
  };

  // Eliminar un producto
  const handleEliminarProducto = (id) => {
    fetch(`http://localhost:5000/api/productos/${id}`, { method: 'DELETE' })
      .then(() => {
        setProductos(productos.filter((producto) => producto._id !== id));
      })
      .catch((err) => console.error(err));
  };

  // Ordenar productos
  const handleOrdenar = (criterio) => {
    const productosOrdenados = [...productos].sort((a, b) => {
      if (criterio === 'nombre') return a.nombre.localeCompare(b.nombre);
      if (criterio === 'precio') return a.precio - b.precio;
      if (criterio === 'cantidad') return a.cantidad - b.cantidad;
      return 0;
    });
    setOrdenarPor(criterio);
    setProductos(productosOrdenados);
  };

  // Filtrar productos por búsqueda
  const productosFiltrados = productos.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="App">
      <h1>Inventario de Ferretería</h1>

      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Buscar por nombre o descripción"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="busqueda"
      />

      {/* Botones para ordenar */}
      <div className="ordenar">
        <button onClick={() => handleOrdenar('nombre')}>Ordenar por Nombre</button>
        <button onClick={() => handleOrdenar('precio')}>Ordenar por Precio</button>
        <button onClick={() => handleOrdenar('cantidad')}>Ordenar por Cantidad</button>
      </div>

      {/* Tabla de productos */}
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map((producto) => (
            <tr key={producto._id}>
              <td>{producto.nombre}</td>
              <td>{producto.descripcion}</td>
              <td>{producto.cantidad}</td>
              <td>${producto.precio}</td>
              <td>
                <button onClick={() => handleEliminarProducto(producto._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Formulario para agregar productos */}
      <form onSubmit={handleAgregarProducto}>
        <h2>Agregar Producto</h2>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={nuevoProducto.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          value={nuevoProducto.descripcion}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="cantidad"
          placeholder="Cantidad"
          value={nuevoProducto.cantidad}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={nuevoProducto.precio}
          onChange={handleChange}
          required
        />
        <button type="submit">Agregar</button>
      </form>
    </div>
  );
}

export default App;
