// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProductos, eliminarProducto } from '../services/api';
import Spinner from '../components/Spinner';

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const res = await getProductos();
      setProductos(res.data);
      setError(null);
    } catch (err) {
      setError('❌ Error: No se pudo conectar con la base de datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      try {
        await eliminarProducto(id);
        cargarProductos(); // Recargar la lista
      } catch (err) {
        alert('Hubo un error al eliminar el producto');
      }
    }
  };

  // Lógica del buscador (Requisito Retador)
  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (loading) return <Spinner />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Lista de Inventario</h2>
        <input 
          type="text" 
          placeholder="Buscar por nombre o categoría..." 
          className="form-control"
          style={{ width: '300px' }}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {error ? (
        <div style={{ backgroundColor: '#f8d7da', padding: '15px', color: '#721c24', borderRadius: '5px' }}>
          {error}
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
          <thead>
            <tr style={{ backgroundColor: '#e9ecef', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No hay productos.</td></tr>
            ) : (
              productosFiltrados.map(producto => (
                <tr key={producto._id || producto.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px' }}>{producto.nombre}</td>
                  <td>{producto.categoria}</td>
                  <td>${producto.precio}</td>
                  <td>{producto.stock}</td>
                  <td>
                    <Link to={`/editar/${producto._id || producto.id}`} className="btn btn-warning" style={{ marginRight: '5px' }}>Editar</Link>
                    <button onClick={() => handleEliminar(producto._id || producto.id)} className="btn btn-danger">Borrar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Home;