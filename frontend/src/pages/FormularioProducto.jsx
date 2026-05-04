// src/pages/FormularioProducto.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { crearProducto, actualizarProducto } from '../services/api';
import { productoSchema } from '../utils/validacion';
import api from '../services/api'; // para obtener un producto específico

const FormularioProducto = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Si hay ID, estamos editando
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    nombre: '', categoria: '', precio: '', stock: ''
  });
  const [erroresValidacion, setErroresValidacion] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Si estamos en modo edición, cargamos los datos del producto
  useEffect(() => {
    if (isEdit) {
      api.get(`/productos/${id}`)
        .then(res => setFormData(res.data))
        .catch(err => console.error('Error al cargar producto:', err));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroresValidacion({});
    setIsSubmitting(true);

    try {
      // Validamos usando Yup
      await productoSchema.validate(formData, { abortEarly: false });

      // Si pasa la validación, enviamos al backend
      if (isEdit) {
        await actualizarProducto(id, formData);
      } else {
        await crearProducto(formData);
      }
      
      // Navegación programática después del éxito
      navigate('/'); 

    } catch (err) {
      if (err.inner) {
        // Errores de Yup
        const errores = {};
        err.inner.forEach(error => { errores[error.path] = error.message; });
        setErroresValidacion(errores);
      } else {
        alert('Error de conexión con el servidor.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
      <h2>{isEdit ? 'Editar Producto' : 'Nuevo Producto'}</h2>
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        
        <div className="form-group">
          <label>Nombre</label>
          <input type="text" name="nombre" className="form-control" value={formData.nombre} onChange={handleChange} />
          {erroresValidacion.nombre && <div className="error-text">{erroresValidacion.nombre}</div>}
        </div>

        <div className="form-group">
          <label>Categoría</label>
          <input type="text" name="categoria" className="form-control" value={formData.categoria} onChange={handleChange} />
          {erroresValidacion.categoria && <div className="error-text">{erroresValidacion.categoria}</div>}
        </div>

        <div className="form-group">
          <label>Precio</label>
          <input type="number" step="0.01" name="precio" className="form-control" value={formData.precio} onChange={handleChange} />
          {erroresValidacion.precio && <div className="error-text">{erroresValidacion.precio}</div>}
        </div>

        <div className="form-group">
          <label>Stock</label>
          <input type="number" name="stock" className="form-control" value={formData.stock} onChange={handleChange} />
          {erroresValidacion.stock && <div className="error-text">{erroresValidacion.stock}</div>}
        </div>

        <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '100%', marginTop: '10px' }}>
          {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
        </button>
      </form>
    </div>
  );
};

export default FormularioProducto;